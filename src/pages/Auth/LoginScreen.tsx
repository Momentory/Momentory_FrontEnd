import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function LoginScreen() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      console.error("=== 카카오 로그인 에러 발생 ===");
      console.error("에러 코드:", error);
      console.error("전체 URL:", window.location.href);

      // 에러 메시지 매핑
      const errorMessages: Record<string, string> = {
        "no_token": "인증 토큰을 받지 못했습니다.",
        "no_user_id": "사용자 정보를 받지 못했습니다.",
        "callback_error": "로그인 처리 중 오류가 발생했습니다.",
      };

      const message = errorMessages[error] || "카카오 로그인에 실패했습니다. 백엔드 로그를 확인해주세요.";
      alert(message);
    }
  }, [error]);

  const handleKakaoLogin = () => {
    console.log("=== 카카오 로그인 시작 ===");
    console.log("현재 위치:", window.location.href);
    console.log("백엔드 OAuth URL로 리다이렉트합니다...");

    // localStorage 초기화 (이전 로그인 정보 제거)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("profileImage");

    console.log("localStorage 초기화 완료");

    const backendOAuthUrl = "https://www.momentory.store/oauth2/authorization/kakao";
    console.log("이동할 URL:", backendOAuthUrl);

    window.location.href = backendOAuthUrl;
  };

  const handleNaverLogin = () => {
    console.log("네이버 로그인 - 아직 미구현");
    alert("네이버 로그인은 준비 중입니다.");
  };

  const handleGoogleLogin = () => {
    console.log("구글 로그인 - 아직 미구현");
    alert("구글 로그인은 준비 중입니다.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-6">

      {/* 로고 섹션 */}
      <div className="flex flex-col items-center mb-40 mt-40">
        <p
          style={{
            fontSize: "13px",
            fontFamily: "Pretendard",
            lineHeight: "100%",
            transform: "scale(0.88)",
            transformOrigin: "left",
            marginBottom: "-15px",
            marginLeft: "-125px",
            letterSpacing: "-0.2px",
            color: "#000",
            opacity: 0.8,
          }}
        >
          나만의 경기도 여행 사진첩,
        </p>

        <div className="w-[282px] h-[85px] flex items-center justify-center scale-[1.7] overflow-hidden">
          <img
            src="/images/splash-logo.png"
            alt="Momentory 로고"
            className="w-full h-auto animate-fadeIn"
          />
        </div>
      </div>

      {/* 로그인 버튼 */}
      <div className="mt-40 w-full max-w-[330px]">
        <Link
          to="/signinscreen"
          className="w-full h-[70px] bg-[#FF7070] text-white text-[16px] font-medium flex items-center justify-center rounded-[25px] mb-4 shadow-sm transition active:scale-95 hover:bg-[#FF5858]"
        >
          로그인
        </Link>

        <Link
          to="/signup"
          className="w-full h-[70px] bg-gray-200 text-gray-600 text-[16px] font-medium flex items-center justify-center rounded-[25px] mb-10 shadow-sm transition active:scale-95 hover:bg-gray-300"
        >
          회원가입
        </Link>

        <div className="w-full h-[1px] bg-gray-300 mb-6"></div>

        {/* 소셜 로그인 */}
        <div className="flex justify-center gap-5">
          
          {/* 카카오 로그인 */}
          <button
            onClick={handleKakaoLogin}
            className="w-10 h-10 rounded-full hover:scale-110 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="카카오 로그인"
          >
            <img
              src="/images/kakao-logo.png"
              alt="카카오 로그인"
              className="w-full h-full rounded-full"
            />
          </button>

          {/* 네이버 로그인 */}
          <button
            onClick={handleNaverLogin}
            className="w-10 h-10 rounded-full hover:scale-110 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="네이버 로그인"
          >
            <img
              src="/images/naver-logo.png"
              alt="네이버 로그인"
              className="w-full h-full rounded-full"
            />
          </button>

          {/* 구글 로그인 */}
          <button
            onClick={handleGoogleLogin}
            className="w-10 h-10 rounded-full hover:scale-110 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="구글 로그인"
          >
            <img
              src="/images/google-logo.png"
              alt="구글 로그인"
              className="w-full h-full rounded-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
