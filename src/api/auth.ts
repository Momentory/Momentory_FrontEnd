import { api } from './client';
import { tokenStore } from '../lib/token';

/* ----------------------------- 타입 정의 ----------------------------- */

// 로그인 응답 타입
interface LoginResponse {
  result: {
    accessToken: string;
    refreshToken: string;
  };
}

// 회원가입 Payload 
export interface SignupPayload {
  email: string;
  password: string;
  nickName: string;

  // Swagger 요구 필드
  name: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  agreeTerms: boolean;
  characterType: string; 

  // 선택 필드
  imageName?: string;
  imageUrl?: string;
  bio?: string;
  externalLink?: string;
  [key: string]: unknown;
}

interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

interface CheckResult {
  available: boolean;
  valid?: boolean;
  message?: string;
}

/* ----------------------------- 회원가입 / 로그인 ----------------------------- */

// 회원가입
export const signup = (payload: SignupPayload) => {
  return api.post('/api/auth/userSignup', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
};

// 로그인
export const login = async (payload: { email: string; password: string }) => {
  try {
    const { data }: { data: LoginResponse } = await api.post('/api/auth/login', payload);
    const { accessToken, refreshToken } = data.result;

    // 저장
    tokenStore.set({ accessToken, refreshToken });
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return data;
  } catch (error) {
    console.error('Login Failed:', error);
    throw error;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    await api.delete('/api/auth/logout');
  } catch (err) {
    console.error('로그아웃 요청 실패:', err);
  } finally {
    tokenStore.clear();
    delete api.defaults.headers.common['Authorization'];
  }
};

// 토큰 재발급
export const reissue = async () => {
  try {
    const { data }: { data: LoginResponse } = await api.post('/api/auth/reissue', {
      refreshToken: tokenStore.getRefresh(),
    });

    tokenStore.set({
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken,
    });

    api.defaults.headers.common['Authorization'] = `Bearer ${data.result.accessToken}`;

    return data.result;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    tokenStore.clear();
    throw error;
  }
};

/* ----------------------------- 이메일 / 닉네임 / 인증 관련 ----------------------------- */

export const sendEmail = async (email: string) => {
  const res = await api.post('/api/auth/send-email', email, {
    headers: { 'Content-Type': 'text/plain' },
  });
  return res.data;
};

export const checkEmail = async (email: string) => {
  const encoded = encodeURIComponent(email);
  const { data } = await api.get(`/api/auth/check-email?email=${encoded}`);
  return data;
};

export const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
  const res = await api.get(`/api/auth/verify-email?token=${token}`);
  return res.data;
};

export const checkNickname = async (nickName: string): Promise<CheckResult> => {
  try {
    const res = await api.get('/api/auth/check-nickname', { params: { nickName } });
    return { available: res.data.result === '중복 없음' };
  } catch (error) {
    console.error('닉네임 중복확인 실패:', error);
    return { available: false };
  }
};

/* ----------------------------- 비밀번호 ----------------------------- */

export const validatePassword = async (password: string) => {
  try {
    const { data } = await api.get('/api/auth/validate-password', {
      params: { password },
    });
    return data;
  } catch (error) {
    console.error('비밀번호 유효성 검사 실패:', error);
    throw error;
  }
};

export const changePassword = (payload: { email: string; newPassword: string }) =>
  api.patch('/api/auth/change-password', payload);

/* ----------------------------- 카카오 프로필 ----------------------------- */

export const setKakaoProfile = (payload: Record<string, unknown>) =>
  api.post('/api/auth/kakao/profile', payload);
