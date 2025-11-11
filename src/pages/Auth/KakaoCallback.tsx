import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    console.log("카카오 로그인 코드:", code);
    alert("임시 로그인 성공! 캐릭터 선택 페이지로 이동합니다.");

    // ✅ 백엔드 없이 임시 로그인 처리
    localStorage.setItem("accessToken", "dummy-token");
    navigate("/auth/select-character");
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <p className="text-gray-600 text-sm">카카오 로그인 중입니다...</p>
    </div>
  );
}
