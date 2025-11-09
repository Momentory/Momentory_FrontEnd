import { api } from "./client";
import { tokenStore } from "../lib/token";

// ----------------------------- 타입 정의 -----------------------------
export interface CheckNicknameResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string; // "중복 없음" | "중복 있음"
}

// ----------------------------- 회원가입 / 로그인 -----------------------------

// 회원가입
export const signup = (payload: {
  email: string;
  password: string;
  nickname: string;
  name?: string;
  phone?: string;
  birth?: string;
}) => api.post("/api/auth/userSignup", payload);

// 로그인
export const login = async (payload: { email: string; password: string }) => {
  const {
    data,
  }: { data: { accessToken: string; refreshToken: string; userId?: number } } =
    await api.post("/api/auth/login", payload);

  tokenStore.set({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  // axios 기본 헤더에 accessToken 반영
  api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

  return data;
};

// ----------------------------- 로그아웃 / 토큰 재발급 -----------------------------

// 로그아웃
export const logout = async () => {
  try {
    await api.delete("/api/auth/logout");
  } catch (err) {
    console.error("로그아웃 요청 실패:", err);
  } finally {
    tokenStore.clear();
  }
};

// 토큰 재발급
export const reissue = async () => {
  const {
    data,
  }: { data: { accessToken: string; refreshToken: string } } = await api.post(
    "/api/auth/reissue",
    {
      refreshToken: tokenStore.getRefresh(),
    }
  );

  tokenStore.set({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
  return data;
};

// ----------------------------- 이메일 / 닉네임 / 인증 관련 -----------------------------

// 이메일 중복확인
export const checkEmail = async (
  email: string
): Promise<{ exists: boolean }> => {
  const res = await api.get("/api/auth/check-email", { params: { email } });
  return res.data;
};

// 이메일 인증 링크 전송
export const sendEmail = async (email: string): Promise<void> => {
  await api.post("/api/auth/send-email", { email });
};

// 이메일 인증 완료 여부 확인
export const checkEmailVerified = async (
  email: string
): Promise<{ verified: boolean }> => {
  const res = await api.get("/api/auth/check-email-verified", {
    params: { email },
  });
  return res.data;
};

// 닉네임 중복 확인
export const checkNickname = async (
  nickName: string
): Promise<{ available: boolean }> => {
  try {
    const res = await api.get<CheckNicknameResponse>(
      "/api/auth/check-nickname",
      { params: { nickName } }
    );

    console.log("서버 응답:", res.data);

    return { available: res.data.result === "중복 없음" };
  } catch (error) {
    console.error("닉네임 중복확인 실패:", error);
    return { available: false };
  }
};

// ----------------------------- 비밀번호 관련 -----------------------------

export const validatePassword = async (
  password: string
): Promise<{ valid: boolean; message?: string }> => {
  const { data } = await api.get("/api/auth/validate-password", {
    params: { password },
  });
  return data;
};

// 비밀번호 변경
export const changePassword = (payload: {
  email: string;
  newPassword: string;
}) => api.patch("/api/auth/change-password", payload);

// ----------------------------- 카카오 프로필 설정 -----------------------------

export const setKakaoProfile = (payload: Record<string, any>) =>
  api.post("/api/auth/kakao/profile", payload);
