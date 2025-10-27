import { Link } from "react-router-dom";

export default function LoginScreen() {
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
        <img
           src="/images/kakao-logo.png"
           alt="카카오 로그인"
           onClick={() => (window.location.href = "https://momentory.site/oauth2/authorization/kakao")}
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
