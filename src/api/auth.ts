import { api } from "./client";
import { tokenStore } from "../lib/token";

/* ----------------------------- 회원가입 / 로그인 ----------------------------- */

export const signup = (payload: any) =>
  api.post("/auth/userSignup", JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });


export const login = async (payload: { email: string; password: string }) => {
  const { data } = await api.post("/auth/login", payload);
  tokenStore.set({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
  return data;
};

export const logout = async () => {
  try {
    await api.delete("/auth/logout");
  } catch (err) {
    console.error("로그아웃 요청 실패:", err);
  } finally {
    tokenStore.clear();
  }
};

export const reissue = async () => {
  const { data } = await api.post("/auth/reissue", {
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
  const res = await api.post("/auth/send-email", email, {
    headers: {
      "Content-Type": "text/plain",
    },
  });

  return res.data;
};

export const checkEmail = async (email: string) => {
  const encoded = encodeURIComponent(email);
  const { data } = await api.get(`/auth/check-email?email=${encoded}`);
  return data;
};



interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
  const res = await api.get(`/api/auth/verify-email?token=${token}`);
  return res.data;
};



// ✅ 닉네임 중복 확인
export const checkNickname = async (nickName: string) => {
  try {
    const res = await api.get("/auth/check-nickname", { params: { nickName } });
    return { available: res.data.result === "중복 없음" };
  } catch (error) {
    console.error("닉네임 중복확인 실패:", error);
    return { available: false };
  }
};

/* ----------------------------- 비밀번호 ----------------------------- */

export const validatePassword = async (password: string) => {
  const { data } = await api.get("/auth/validate-password", { params: { password } });
  return data;
};

export const changePassword = (payload: { email: string; newPassword: string }) =>
  api.patch("/auth/change-password", payload);

/* ----------------------------- 카카오 프로필 ----------------------------- */

export const setKakaoProfile = (payload: Record<string, any>) =>
  api.post("/auth/kakao/profile", payload);
