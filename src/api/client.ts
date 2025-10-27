import axios, { AxiosError } from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import { tokenStore } from "../lib/token";

// ✅ 1. Axios 인스턴스 생성
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env에서 불러오기
  withCredentials: false, // 쿠키 기반이면 true로 변경
  headers: { "Content-Type": "application/json" },
});

// ✅ 2. 요청 인터셉터: AccessToken 자동 첨부
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = tokenStore.getAccess();
  if (access) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${access}`;
  }
  return config;
});

// ✅ 3. 토큰 재발급 관련 상태 관리
let isRefreshing = false;
let requestQueue: Array<(token: string) => void> = [];

const processQueue = (newAccess: string) => {
  requestQueue.forEach((cb) => cb(newAccess));
  requestQueue = [];
};

// ✅ 4. 응답 인터셉터: 401 처리 → RefreshToken 재발급 → 원요청 재시도
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

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/reissue`,
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
