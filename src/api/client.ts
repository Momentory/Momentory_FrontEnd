import axios, { AxiosError } from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenStore } from "../lib/token";

// Axios 인스턴스 생성
export const api = axios.create({
  baseURL: "/api", // 환경변수 기반으로 바꿔도 무방
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터: AccessToken 자동 첨부 (비로그인용 API 예외 처리 포함)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = tokenStore.getAccess();

  // 토큰을 첨부하지 않을 엔드포인트 목록
  const noAuthUrls = [
  "/api/auth/check-email",
  "/api/auth/check-nickname",
  "/api/auth/send-email",
  "/api/auth/check-email-verified",
  "/api/auth/validate-password",
  "/api/auth/userSignup",
  "/api/auth/login",
  "/api/auth/reissue",
];


  // 요청 URL이 예외 목록에 포함되어 있는지 확인
  const isNoAuth = noAuthUrls.some((url) => config.url?.includes(url));

  // 비로그인용 API가 아닐 경우에만 토큰 추가
  if (access && !isNoAuth) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${access}`;
  }

  return config;
});

// 토큰 재발급 상태 관리
let isRefreshing = false;
let requestQueue: Array<(token: string) => void> = [];

const processQueue = (newAccess: string) => {
  requestQueue.forEach((cb) => cb(newAccess));
  requestQueue = [];
};

// 응답 인터셉터: 401 → RefreshToken 재발급 후 재시도
api.interceptors.response.use(
  (response: AxiosResponse<any>) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    if (!original || original._retry) throw error;

    if (status === 401) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push((newAccess) => {
            original.headers = original.headers ?? {};
            (original.headers as any).Authorization = `Bearer ${newAccess}`;
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

        // RefreshToken으로 재발급 요청
        const { data } = await axios.post(
          "https://www.momentory.store/api/auth/reissue",
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccess = (data as any).accessToken;
        const newRefresh = (data as any).refreshToken ?? refreshToken;

        tokenStore.set({
          accessToken: newAccess,
          refreshToken: newRefresh,
        });

        processQueue(newAccess);

        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        tokenStore.clear();
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);
