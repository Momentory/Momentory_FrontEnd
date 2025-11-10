import { Link, useNavigate } from "react-router-dom"; // useNavigate 임포트

export default function LoginScreen() {
  const navigate = useNavigate(); // navigate 훅 사용 선언

  // 카카오 로그인을 건너뛰고 강제로 이동시키는 임시 함수
  const handleTempKakaoLogin = () => {
    console.log("카카오 로그인 건너뛰기 (임시)");
    alert("임시 로그인 성공! 캐릭터 선택 페이지로 이동합니다.");
    
    // 1. 임시 토큰을 저장 (로그인 된 척)
    localStorage.setItem("accessToken", "dummy-token-for-ui-test");
    
    // 2. 캐릭터 선택 페이지로 강제 이동
    navigate("/auth/select-character");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center mb-28">
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

      <Link
        to="/signinscreen"
        className="w-[330px] h-[70px] bg-[#FF7070] text-white text-[16px] font-medium flex items-center justify-center rounded-[25px] mb-4 shadow-sm transition active:scale-95"
      >
        로그인
      </Link>

      <Link
        to="/signup"
        className="w-[330px] h-[70px] bg-gray-200 text-gray-600 text-[16px] font-medium flex items-center justify-center rounded-[25px] mb-10 shadow-sm transition active:scale-95"
      >
        회원가입
      </Link>

      <div className="w-[330px] h-[1px] bg-gray-300 mb-6"></div>

      <div className="flex justify-center space-x-5">
        {/* ✅ 카카오 로그인 onClick 수정 */}
        <img
          src="/images/kakao-logo.png"
          alt="카카오 로그인"
          onClick={handleTempKakaoLogin} // 여기서 임시 함수를 호출
          className="w-10 h-10 rounded-full hover:scale-110 transition cursor-pointer"
        />

        <img
          src="/images/naver-logo.png"
          alt="네이버 로그인"
          className="w-10 h-10 rounded-full hover:scale-110 transition"
        />

        <img
          src="/images/google-logo.png"
          alt="구글 로그인"
          className="w-10 h-10 rounded-full hover:scale-110 transition"
        />
      </div>
    </div>
  );
}