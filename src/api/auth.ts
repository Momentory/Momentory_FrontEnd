import { api } from "./client";
import { tokenStore } from "../lib/token";
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
  const { data }: { data: { result: { accessToken: string; refreshToken: string } } } =
    await api.post("/auth/login", payload);

  const { accessToken, refreshToken } = data.result;

  // 토큰 저장
  tokenStore.set({ accessToken, refreshToken });

  // Axios 인스턴스에도 즉시 반영
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  return data.result;
};


export const logout = async () => {
  await api.delete("/api/auth/logout");
  tokenStore.clear();
};

export const reissue = async () => {
  const { data }: { data: { result: { accessToken: string; refreshToken: string } } } =
    await api.post("/api/auth/reissue", {
      refreshToken: tokenStore.getRefresh(),
    });
  tokenStore.set({ accessToken: data.result.accessToken, refreshToken: data.result.refreshToken });
  return data.result;
};


// 검증/중복확인/이메일 관련
export const checkEmail = (email: string) =>
  api.get("/auth/check-email", { params: { email} });

// 닉네임 중복 확인
export const checkNickname = async (nickname: string) => {
  try {
    const res = await api.get("/api/auth/check-nickname", {
      params: { nickname },
    });
    console.log("서버 응답 전체:", res);

    //백엔드가 data 없이 200만 주는 경우 true로 처리
    if (res.status === 200 && !res.data) {
      return { available: true };
    }

    // axios 구조에서는 res.data가 실제 body
    return res.data; // body만 리턴
  } catch (error) {
    console.error("닉네임 중복확인 실패:", error);
    throw error;
  }
};


export const sendEmail = (email: string) =>
  api.post("/auth/send-email", { email });

export const checkEmailVerified = (email: string) =>
  api.get("/auth/check-email-verified", { params: { email } });

// 비밀번호 유효성 검사
export const validatePassword = async (
  password: string
): Promise<{ valid: boolean; message?: string }> => {
  const { data } = await api.get("/api/auth/validate-password", {
    params: { password },
  });
  return data;
};


export const changePassword = (payload: { email: string; newPassword: string }) =>
  api.patch("/api/auth/change-password", payload);

// (선택) 카카오 프로필 설정 (isProfileComplete 플로우용)
export const setKakaoProfile = (payload: Record<string, any>) =>
  api.post("/api/auth/kakao/profile", payload);


