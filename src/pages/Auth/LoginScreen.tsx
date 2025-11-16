import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function LoginScreen() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("profileImage");

    const backendOAuthUrl =
      "https://www.momentory.store/oauth2/authorization/kakao";

    window.location.href = backendOAuthUrl;
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-white px-6 py-10">
      {/* 로고 섹션 */}
      <div className="flex flex-col items-center mt-32">
        <p
          style={{
            fontSize: "13px",
            fontFamily: "Pretendard",
            lineHeight: "100%",
            transform: "scale(0.88)",
            transformOrigin: "left",
            marginBottom: "-12px",
            marginLeft: "-90px",
            letterSpacing: "-0.2px",
            color: "#000",
            opacity: 0.8,
          }}
        >
          나만의 경기도 여행 사진첩,
        </p>

        <div className="w-[260px] h-[80px] flex items-center justify-center scale-[1.6] overflow-hidden">
          <img
            src="/images/splash-logo.png"
            alt="Momentory 로고"
            className="w-full h-auto animate-fadeIn"
          />
        </div>
      </div>

      {/* 로그인 버튼들 */}
      <div className="w-full max-w-[330px] -mt-10">
        <Link
          to="/signinscreen"
          className="w-full h-[70px] bg-[#FF7070] text-white text-[16px] font-medium flex items-center justify-center rounded-[25px] mb-4 shadow-sm"
        >
          로그인
        </Link>

        <Link
          to="/signup"
          className="w-full h-[70px] bg-gray-200 text-gray-600 text-[16px] font-medium flex items-center justify-center rounded-[25px] mb-8 shadow-sm"
        >
          회원가입
        </Link>

        <div className="w-full h-[1px] bg-gray-300 mb-6" />

        {/* 소셜 로그인 아이콘 */}
        <div className="flex justify-center gap-5 mb-4">
          <button
            onClick={handleKakaoLogin}
            className="w-10 h-10 rounded-full hover:scale-110 transition"
          >
            <img
              src="/images/kakao-logo.png"
              alt="카카오 로그인"
              className="w-full h-full rounded-full"
            />
          </button>

          <button className="w-10 h-10 rounded-full hover:scale-110 transition">
            <img
              src="/images/naver-logo.png"
              alt="네이버 로그인"
              className="w-full h-full rounded-full"
            />
          </button>

          <button className="w-10 h-10 rounded-full hover:scale-110 transition">
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
