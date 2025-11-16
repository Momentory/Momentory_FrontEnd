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
  nickName: string;          // ← Swagger 기준: nickname
  name: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  agreeTerms: boolean;
  characterType: string;     // "CAT" 등 백엔드 enum

  // 선택 필드
  imageName?: string;
  imageUrl?: string;
  bio?: string;
  externalLink?: string;
  [key: string]: unknown;
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

//이메일 전송
export const sendEmail = async (email: string) => {
  return api.post('/api/auth/send-email', email, {
    headers: { "Content-Type": "text/plain" },
  });
};



// 이메일 중복 체크
export const checkEmail = async (email: string) => {
  const encoded = encodeURIComponent(email);
  const { data } = await api.get(`/api/auth/check-email?email=${encoded}`);
  return data;
};

// 이메일 인증 여부 확인
export const checkEmailVerified = async (email: string) => {
  const encoded = encodeURIComponent(email);
  const { data } = await api.get(`/api/auth/check-email-verified?email=${encoded}`);
  return data;
};

// 닉네임 중복 체크 
export const checkNickname = async (nickname: string): Promise<CheckResult> => {
  try {
    const res = await api.get('/api/auth/check-nickname', {
      params: { nickname },
    });

    // 숫자 1 또는 "1" 이면 사용 가능
    if (typeof res.data === "number" || typeof res.data === "string") {
      return { available: Number(res.data) === 1 };
    }

    // result 필드 있을 때
    if (res.data?.result !== undefined) {
      return { available: Number(res.data.result) === 1 };
    }

    return { available: true };

  } catch (error) {
    console.warn("닉네임 중복 API 없음 → 그냥 사용 가능으로 처리");
    return { available: true };  // ← 여기 핵심!
  }
};



/* ----------------------------- 비밀번호 ----------------------------- */

// 비밀번호 검증
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

// 비밀번호 변경
export const changePassword = (payload: { email: string; newPassword: string }) =>
  api.patch('/api/auth/change-password', payload);

/* ----------------------------- 카카오 프로필 ----------------------------- */

export const setKakaoProfile = (payload: Record<string, unknown>) =>
  api.post('/api/auth/kakao/profile', payload);
