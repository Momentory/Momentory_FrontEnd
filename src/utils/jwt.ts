import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string; // subject (일반적으로 userId)
  userId?: number;
  id?: number;
  email?: string;
  exp?: number;
  iat?: number;
}

/**
 * JWT 토큰에서 userId를 추출합니다.
 * @param token JWT 액세스 토큰
 * @returns userId 또는 null
 */
export const getUserIdFromToken = (token: string | null): number | null => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // userId 필드가 있으면 반환
    if (decoded.userId) {
      return decoded.userId;
    }

    // id 필드가 있으면 반환
    if (decoded.id) {
      return decoded.id;
    }

    // sub 필드를 숫자로 변환 시도
    if (decoded.sub) {
      const userId = parseInt(decoded.sub, 10);
      if (!isNaN(userId)) {
        return userId;
      }
    }

    console.warn("JWT 토큰에서 userId를 찾을 수 없습니다:", decoded);
    return null;
  } catch (error) {
    console.error("JWT 토큰 디코딩 실패:", error);
    return null;
  }
};

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 * @param token JWT 액세스 토큰
 * @returns 만료 여부
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      return false;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("JWT 토큰 디코딩 실패:", error);
    return true;
  }
};
