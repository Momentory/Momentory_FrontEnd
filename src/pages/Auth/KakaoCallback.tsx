import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      alert("카카오 로그인 실패");
      navigate("/login");
      return;
    }

    // 카카오 인가 코드를 백엔드로 전송
    axios
      .get(`https://www.momentory.store/api/auth/kakao/callback?code=${code}`)
      .then((res) => {
        // 로그인 성공 시 토큰 저장
        localStorage.setItem("accessToken", res.data.accessToken);

        // 캐릭터 선택 페이지로 이동
        navigate("/auth/select-character");
      })
      .catch(() => {
        navigate("/login?error");
      });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <p className="text-gray-600 text-sm">카카오 로그인 중입니다...</p>
    </div>
  );
}
