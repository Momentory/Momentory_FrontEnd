import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { tokenStore } from "../lib/token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // cookie(httponly) 기반이면 true로 변경
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const access = tokenStore.getAccess();
  if (access) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${access}`;
  }
  return config;
});


// --- 토큰 재발급 관련 상태값 ---
let isRefreshing = false;
let requestQueue: Array<(token: string) => void> = [];

const processQueue = (newAccess: string) => {
  requestQueue.forEach((cb) => cb(newAccess));
  requestQueue = [];
};

// --- 응답 인터셉터 ---
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // 원 요청이 없거나 이미 재시도한 요청이면 그냥 throw
    if (!original || original._retry) throw error;

    if (status === 401) {
      if (isRefreshing) {
        // 이미 재발급 중이면 큐에 등록 후 대기
        return new Promise((resolve) => {
          requestQueue.push((newAccess) => {
            original.headers = original.headers ?? {};
            (original.headers as any).Authorization = `Bearer ${newAccess}`;
            resolve(api(original)); // 새 토큰으로 재요청
          });
        });
      }

      // 최초 401 처리
      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStore.getRefresh();
        if (!refreshToken) {
          tokenStore.clear();
          throw error;
        }

        // 백엔드 명세: POST /api/auth/reissue
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/reissue`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        // 응답: { accessToken, refreshToken }
        const newAccess = (data as any).accessToken;
        const newRefresh = (data as any).refreshToken ?? refreshToken;

        tokenStore.set({
          accessToken: newAccess,
          refreshToken: newRefresh,
        });

        // 대기 중인 요청들 처리
        processQueue(newAccess);

        // 원 요청 재시도
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        tokenStore.clear(); // refresh 실패 시 완전 로그아웃 처리
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    // 다른 에러는 그대로 throw
    throw error;
  }
);
