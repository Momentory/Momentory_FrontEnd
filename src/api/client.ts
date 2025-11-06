// 프로젝트 전역에서 사용할 Axios 인스턴스 및 토큰 관리(주입, 재발급) 인터셉터 설정

import axios from 'axios';

import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';
import { tokenStore } from '../lib/token';

interface ReissueResponse {
  accessToken: string;
  refreshToken?: string;
}

// Axios 인스턴스 생성
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: AccessToken 자동 첨부 (비로그인용 API 예외 처리 포함)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = tokenStore.getAccess();

  // 토큰을 첨부하지 않을 엔드포인트 목록 (baseURL 제외)
  const noAuthUrls = [
    '/auth/check-email',
    '/auth/check-nickname',
    '/auth/send-email',
    '/auth/check-email-verified',
    '/auth/validate-password',
    '/auth/userSignup',
    '/auth/login',
    '/auth/reissue',
  ];

  // config.url은 baseURL이 제외된 형태
  const isNoAuth = noAuthUrls.some((url) => config.url?.includes(url));

  // 비로그인용 API가 아닐 경우에만 토큰 추가
  if (access && !isNoAuth) {
    config.headers = config.headers ?? {};
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${access}`;
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
  (response: AxiosResponse<unknown>) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      console.error('Axios 인터셉터 오류 (네트워크 외):', error);
      throw error;
    }

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

        // 상대 경로로 변경
        // 전역 axios를 사용해 프록시(/api)를 타도록 함
        const { data } = await axios.post<ReissueResponse>(
          '/api/auth/reissue',
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccess = data.accessToken;
        const newRefresh = data.refreshToken ?? refreshToken;

        tokenStore.set({
          accessToken: newAccess,
          refreshToken: newRefresh,
        });

        processQueue(newAccess);

        original.headers = original.headers ?? {};
        (original.headers as AxiosRequestHeaders).Authorization =
          `Bearer ${newAccess}`;
        return api(original);
      } catch (reissueError) {
        tokenStore.clear();

        // 재발급 요청이 실패한 경우
        if (axios.isAxiosError(reissueError)) {
          console.error(
            '토큰 재발급 실패 (Axios Error):',
            reissueError.response?.data
          );
        } else {
          console.error('토큰 재발급 중 알 수 없는 오류:', reissueError);
        }

        // 재발급 실패 에러를 throw
        throw reissueError;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);
