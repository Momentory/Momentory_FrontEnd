import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "../lib/token";

/* ----------------------------- 기본 설정 ----------------------------- */

// // 환경별 API 주소 자동 전환 (로컬/운영 모두 대응)
// const BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "https://www.momentory.store";

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: "https://www.momentory.store",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ----------------------------- 요청 인터셉터 ----------------------------- */

// 비로그인용 API 예외 목록
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

// AccessToken 자동 첨부
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = tokenStore.getAccess();

  const isNoAuth = noAuthUrls.some((url) =>
    config.url?.includes(url.replace("/api", ""))
  );

  if (access && !isNoAuth) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${access}`;
  }

  return config;
});

/* ----------------------------- 재발급 관리 변수 ----------------------------- */

let isRefreshing = false;
let requestQueue: Array<(token: string) => void> = [];

const processQueue = (newAccess: string) => {
  requestQueue.forEach((cb) => cb(newAccess));
  requestQueue = [];
};

/* ----------------------------- 응답 인터셉터 ----------------------------- */

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
