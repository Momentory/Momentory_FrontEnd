import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from 'axios';
import { tokenStore } from '../lib/token';

interface ReissueResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
  };
}

/* ----------------------------- Axios 기본 설정 ----------------------------- */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* ----------------------------- 요청 인터셉터 ----------------------------- */
const noAuthUrls = [
  "/api/auth/login",
  "/api/auth/userSignup",
  "/api/auth/send-email",
  "/api/auth/check-email",
  "/api/auth/check-email-verified",
  "/api/auth/check-nickname",
  "/api/auth/kakao/callback",
  "/api/auth/reissue",
];

// config.url이 undefined일 수 있으므로 안전하게 처리
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    const reqUrl = config.url ?? ""; // ← 안전 처리

    //  startsWith 사용 (includes 쓰면 /auth 포함된 다른 API도 충돌)
    if (noAuthUrls.some((url) => reqUrl.startsWith(url))) {
      delete config.headers.Authorization;
    } else {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ----------------------------- 응답 인터셉터 ----------------------------- */
api.interceptors.response.use(
  (response: AxiosResponse<unknown>) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;

    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (!original || original._retry) throw error;

    // ------------------ 401 → refresh token 재발급 ------------------
    if (status === 401) {
      try {
        const refreshToken = tokenStore.getRefresh?.();
        if (!refreshToken) {
          tokenStore.clear?.();
          throw error;
        }

        const { data } = await api.post<ReissueResponse>("/api/auth/reissue", {
          refreshToken,
        });

        tokenStore.set?.({
          accessToken: data.result.accessToken,
          refreshToken: data.result.refreshToken ?? refreshToken,
        });

        api.defaults.headers.common["Authorization"] =
          `Bearer ${data.result.accessToken}`;

        original.headers = original.headers ?? {};
        (original.headers as AxiosRequestHeaders).Authorization =
          `Bearer ${data.result.accessToken}`;

        original._retry = true;
        return api(original);
      } catch (err) {
        tokenStore.clear?.();
        console.error("토큰 재발급 실패:", err);
        throw err;
      }
    }

    if (error.code === "ERR_NETWORK") {
      console.error("네트워크 연결 실패 (서버 응답 없음)");
    }

    throw error;
  }
);
