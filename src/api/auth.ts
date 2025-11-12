import { api } from './client';
import { tokenStore } from '../lib/token';

<<<<<<< HEAD
/* ----------------------------- 회원가입 / 로그인 ----------------------------- */

export const signup = (payload: any) =>
  api.post("/api/auth/userSignup", JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });


export const login = async (payload: { email: string; password: string }) => {
 const { data } = await api.post("/api/auth/login", payload);

const { accessToken, refreshToken } = data.result;

tokenStore.set({
  accessToken,
  refreshToken,
});

api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
return data;

};

export const logout = async () => {
  try {
    await api.delete("/api/auth/logout");
  } catch (err) {
    console.error("로그아웃 요청 실패:", err);
  } finally {
    tokenStore.clear();
  }
};

export const reissue = async () => {
  const { data } = await api.post("/api/auth/reissue", {
    refreshToken: tokenStore.getRefresh(),
  });
  tokenStore.set({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
  return data;
};

/* ----------------------------- 이메일 / 닉네임 / 인증 관련 ----------------------------- */

export const sendEmail = async (email: string) => {
  const res = await api.post("/api/auth/send-email", email, {
    headers: {
      "Content-Type": "text/plain",
    },
  });

  return res.data;
};

export const checkEmail = async (email: string) => {
  const encoded = encodeURIComponent(email);
  const { data } = await api.get(`/api/auth/check-email?email=${encoded}`);
  return data;
};
=======
/* ----------------------------- 타입 정의 ----------------------------- */
>>>>>>> b8c6f92ddcf48f5ab703f692326b571fb1077fb8

interface LoginResponse {
  result: {
    accessToken: string;
    refreshToken: string;
  };
}

interface SignupPayload {
  email: string;
  password: string;
  nickname: string;
  [key: string]: unknown; // 추가적인 필드가 있을 경우를 대비
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

export const signup = (payload: SignupPayload) =>
  api.post('/api/auth/userSignup', JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });

export const login = async (payload: { email: string; password: string }) => {
  try {
    const { data }: { data: LoginResponse } = await api.post(
      '/api/auth/login',
      payload
    );

    const { accessToken, refreshToken } = data.result;

    tokenStore.set({
      accessToken,
      refreshToken,
    });

    // 로그인 성공 시 헤더에 즉시 적용
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return data;
  } catch (error) {
    console.error('Login Failed:', error);
    throw error;
  }
};

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

export const reissue = async () => {
  try {
    const { data }: { data: LoginResponse } = await api.post(
      '/api/auth/reissue',
      {
        refreshToken: tokenStore.getRefresh(),
      }
    );

    tokenStore.set({
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken,
    });

    api.defaults.headers.common['Authorization'] =
      `Bearer ${data.result.accessToken}`;

    return data.result;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    tokenStore.clear();
    throw error;
  }
};

/* ----------------------------- 이메일 / 닉네임 / 인증 관련 ----------------------------- */

export const sendEmail = async (email: string) => {
  const res = await api.post(
    '/api/auth/send-email',
    { email },
    {
      headers: {
        'Content-Type': 'application/json', // 일반적인 JSON 전송으로 통일
      },
    }
  );
  return res.data;
};

export const checkEmail = async (email: string) => {
  const { data } = await api.get('/api/auth/check-email', {
    params: { email },
  });
  return data;
};

export const checkEmailVerified = (email: string) =>
  api.get('/api/auth/check-email-verified', { params: { email } });

export const verifyEmail = async (
  token: string
): Promise<VerifyEmailResponse> => {
  const res = await api.get(`/api/auth/verify-email?token=${token}`);
  return res.data;
};

<<<<<<< HEAD


// 닉네임 중복 확인
export const checkNickname = async (nickName: string) => {
  try {
    const res = await api.get("/api/auth/check-nickname", { params: { nickName } });
    return { available: res.data.result === "중복 없음" };
=======
// 닉네임 중복 확인
export const checkNickname = async (nickName: string): Promise<CheckResult> => {
  try {
    const res = await api.get('/api/auth/check-nickname', {
      params: { nickName },
    });
    // 서버 응답 구조에 따라 '중복 없음' 체크 로직 유지
    return { available: res.data.result === '중복 없음' };
>>>>>>> b8c6f92ddcf48f5ab703f692326b571fb1077fb8
  } catch (error) {
    console.error('닉네임 중복확인 실패:', error);
    return { available: false };
  }
};

/* ----------------------------- 비밀번호 ----------------------------- */

<<<<<<< HEAD
export const validatePassword = async (password: string) => {
  const { data } = await api.get("/api/auth/validate-password", { params: { password } });
  return data;
};

export const changePassword = (payload: { email: string; newPassword: string }) =>
  api.patch("/api/auth/change-password", payload);

/* ----------------------------- 카카오 프로필 ----------------------------- */

export const setKakaoProfile = (payload: Record<string, any>) =>
  api.post("/api/auth/kakao/profile", payload);
=======
export const validatePassword = async (
  password: string
): Promise<{ valid: boolean; message?: string }> => {
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

export const changePassword = (payload: {
  email: string;
  newPassword: string;
}) => api.patch('/api/auth/change-password', payload);

/* ----------------------------- 카카오 프로필 ----------------------------- */

export const setKakaoProfile = (payload: Record<string, unknown>) =>
  api.post('/api/auth/kakao/profile', payload);
>>>>>>> b8c6f92ddcf48f5ab703f692326b571fb1077fb8
