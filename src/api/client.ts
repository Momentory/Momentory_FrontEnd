import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from "axios";
import { tokenStore } from "../lib/token";

/* ----------------------------- 타입 정의 ----------------------------- */
interface ReissueResponse {
  accessToken: string;
  refreshToken?: string;
}

/* ----------------------------- Axios 기본 설정 ----------------------------- */

// 개발/배포 모두 Vite proxy 기준 경로(`/api`) 사용
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ----------------------------- 요청 인터셉터 ----------------------------- */

// 토큰 제외 대상 API (로그인, 회원가입 등)
const noAuthUrls = [
  "/auth/check-email",
  "/auth/check-nickname",
  "/auth/send-email",
  "/auth/check-email-verified",
  "/auth/validate-password",
  "/auth/userSignup",
  "/auth/login",
  "/auth/reissue",
];

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = tokenStore.getAccess();
  const isNoAuth = noAuthUrls.some((url) => config.url?.includes(url));

  if (access && !isNoAuth) {
    config.headers = config.headers ?? {};
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${access}`;
  }

  return config;
});

/* ----------------------------- 재발급 관리용 큐 ----------------------------- */

let isRefreshing = false;
let requestQueue: Array<(token: string) => void> = [];

const processQueue = (newAccess: string) => {
  requestQueue.forEach((cb) => cb(newAccess));
  requestQueue = [];
};

/* ----------------------------- 응답 인터셉터 ----------------------------- */

api.interceptors.response.use(
  (response: AxiosResponse<unknown>) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      console.error("Axios 인터셉터 오류 (네트워크 외):", error);
      throw error;
    }

    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // 재시도 중복 방지
    if (!original || original._retry) throw error;

    // 401 Unauthorized → 토큰 재발급 시도
    if (status === 401) {
      if (isRefreshing) {
        // 이미 재발급 중이면 큐에 대기
        return new Promise((resolve) => {
          requestQueue.push((newAccess) => {
            original.headers = original.headers ?? {};
            (original.headers as AxiosRequestHeaders).Authorization =
              `Bearer ${newAccess}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStore.getRefresh();
        if (!refreshToken) {
          tokenStore.clear();
          throw error;
        }

        // /api/auth/reissue 호출
        const { data } = await axios.post<ReissueResponse>(
          "/api/auth/reissue",
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccess = data.accessToken;
        const newRefresh = data.refreshToken ?? refreshToken;

        // 토큰 저장 및 헤더 갱신
        tokenStore.set({
          accessToken: newAccess,
          refreshToken: newRefresh,
        });

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        processQueue(newAccess);

        // 실패했던 요청 재시도
        original.headers = original.headers ?? {};
        (original.headers as AxiosRequestHeaders).Authorization =
          `Bearer ${newAccess}`;
        return api(original);
      } catch (reissueError) {
        tokenStore.clear();

        if (axios.isAxiosError(reissueError)) {
          console.error(
            "토큰 재발급 실패 (Axios Error):",
            reissueError.response?.data
          );
        } else {
          console.error("토큰 재발급 중 알 수 없는 오류:", reissueError);
        }

        throw reissueError;
      } finally {
        isRefreshing = false;
      }
    }

    // 그 외 에러는 그대로 throw
    throw error;
  }
);
