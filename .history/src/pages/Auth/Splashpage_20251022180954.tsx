import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center leading-none">
        <p
  style={{
    fontSize: "13px",
    fontFamily: "Pretendard",
    lineHeight: "100%",
    transform: "scale(0.88)",
    transformOrigin: "left",
    marginBottom: "-2px",
    marginLeft: "-18px",
    letterSpacing: "-0.2px",
    color: "#000",
    opacity: 0.8,
  }}
>
  나만의 경기도 여행 사진첩,
</p>
        <img
          src="/images/splash-logo.png"
          alt="모멘토리 로고"
          className="w-[282px] h-auto mt-[-120px] animate-fadeIn"
        />
      </div>
    </div>
  );
}
