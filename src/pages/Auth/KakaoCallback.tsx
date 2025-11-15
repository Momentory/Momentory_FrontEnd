// src/pages/Auth/KakaoCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        // 전체 URL 정보 로깅
        console.log("=== 카카오 콜백 디버깅 시작 ===");
        console.log("전체 URL:", window.location.href);
        console.log("Search params:", window.location.search);
        console.log("Hash:", window.location.hash);

        // URL 파라미터 파싱
        const params = new URLSearchParams(window.location.search);
        
        // 모든 파라미터 출력
        console.log("=== 받은 파라미터 목록 ===");
        for (let [key, value] of params.entries()) {
          console.log(`${key}:`, value);
        }

        const token = params.get("accessToken");
        const userId = params.get("userId");
        const kakaoNickname = params.get("kakaoNickname");
        const profileImage = params.get("profileImage");
        const isProfileCompleted = params.get("isProfileCompleted") === "true";

        console.log("=== 파싱된 값들 ===");
        console.log("token:", token);
        console.log("userId:", userId);
        console.log("kakaoNickname:", kakaoNickname);
        console.log("profileImage:", profileImage);
        console.log("isProfileCompleted:", isProfileCompleted);

        // 토큰 검증
        if (!token) {
          console.error("❌ 토큰이 없습니다!");
          setError("인증 토큰을 받지 못했습니다.");
          setTimeout(() => {
            navigate("/login?error=no_token", { replace: true });
          }, 2000);
          return;
        }

        // userId 검증
        if (!userId) {
          console.error("❌ userId가 없습니다!");
          setError("사용자 정보를 받지 못했습니다.");
          setTimeout(() => {
            navigate("/login?error=no_user_id", { replace: true });
          }, 2000);
          return;
        }

        // 안전하게 디코딩
        const safeNickname = kakaoNickname ? decodeURIComponent(kakaoNickname) : "";
        const safeProfileImage = profileImage ? decodeURIComponent(profileImage) : "";

        console.log("=== 디코딩된 값들 ===");
        console.log("nickname:", safeNickname);
        console.log("profileImage:", safeProfileImage);

        // localStorage 저장
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("nickname", safeNickname);
        localStorage.setItem("profileImage", safeProfileImage);

        console.log("✅ localStorage 저장 완료");
        console.log("=== 저장된 값 확인 ===");
        console.log("accessToken:", localStorage.getItem("accessToken"));
        console.log("userId:", localStorage.getItem("userId"));
        console.log("nickname:", localStorage.getItem("nickname"));
        console.log("profileImage:", localStorage.getItem("profileImage"));

        // 페이지 이동
        if (isProfileCompleted) {
          console.log("✅ 프로필 완료 → /home으로 이동");
          navigate("/home", { replace: true });
        } else {
          console.log("✅ 프로필 미완료 → /select로 이동");
          navigate("/select", { replace: true });
        }

      } catch (err) {
        console.error("❌ 콜백 처리 중 오류:", err);
        setError("로그인 처리 중 오류가 발생했습니다.");
        setTimeout(() => {
          navigate("/login?error=callback_error", { replace: true });
        }, 2000);
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      {error ? (
        <>
          <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
          <div className="text-gray-400 text-xs">로그인 페이지로 돌아갑니다...</div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <svg
              className="animate-spin h-8 w-8 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 text-sm">카카오 로그인 중입니다...</p>
          <p className="text-gray-400 text-xs mt-2">잠시만 기다려주세요</p>
        </>
      )}
    </div>
  );
}