import { api } from "./client";
import { tokenStore } from "../lib/token";
type Tokens = import("../lib/token").Tokens;


// --- 명세에 있는 엔드포인트들 ---

export const signup = (payload: {
  email: string;
  password: string;
  nickname: string;
  name?: string;
  phone?: string;
  birth?: string;
}) => api.post("/api/auth/userSignup", payload);

export const login = async (payload: { email: string; password: string }) => {
  const { data }: { data: { accessToken: string; refreshToken: string } } =
    await api.post("/api/auth/login", payload);
  tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
};

export const logout = async () => {
  await api.delete("/api/auth/logout");
  tokenStore.clear();
};

export const reissue = async () => {
  const { data }: { data: { accessToken: string; refreshToken: string } } =
    await api.post("/api/auth/reissue", {
      refreshToken: tokenStore.getRefresh(),
    });
  tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
};

// 검증/중복확인/이메일 관련
export const checkEmail = (email: string) =>
  api.get("/api/auth/check-email", { params: { email } });

export const checkNickname = (nickname: string) =>
  api.get("/api/auth/check-nickname", { params: { nickname } });

export const sendEmail = (email: string) =>
  api.post("/api/auth/send-email", { email });

export const checkEmailVerified = (email: string) =>
  api.get("/api/auth/check-email-verified", { params: { email } });

// 비밀번호 유효성 체크 & 변경
export const validatePassword = (password: string) =>
  api.get("/api/auth/validate-password", { params: { password } });

export const changePassword = (payload: { email: string; newPassword: string }) =>
  api.patch("/api/auth/change-password", payload);

// (선택) 카카오 프로필 설정 (isProfileComplete 플로우용)
export const setKakaoProfile = (payload: Record<string, any>) =>
  api.post("/api/auth/kakao/profile", payload);
