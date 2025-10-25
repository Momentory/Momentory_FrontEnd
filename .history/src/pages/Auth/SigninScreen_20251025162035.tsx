import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/auth";
import { tokenStore } from "../../lib/token";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email, password });

      // 응답에서 accessToken, refreshToken 받음
      tokenStore.set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      alert("로그인 성공!");
      navigate("/splash"); // 로그인 후 이동할 경로 (원하면 변경 가능)
    } catch (err: any) {
      console.error(err);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* 상단 로고 */}
      <div className="flex flex-col items-center mb-12">
        <img
          src="/images/momentory_logo.svg"
          alt="Momentory Logo"
          className="w-[150px] mb-4"
        />
        <h1 className="text-[24px] font-semibold text-black">Momentory</h1>
        <p className="text-gray-500 text-[14px]">나만의 여행 앨범</p>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col w-[332px] space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
        />

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-[55px] text-white text-[16px] font-semibold rounded-[15px] ${
            loading ? "bg-gray-400" : "bg-[#FF7070]"
          } transition active:scale-95`}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {/* 회원가입 링크 */}
        <div className="flex justify-center mt-3 text-[14px] text-gray-500">
          계정이 없으신가요?{" "}
          <Link to="/create-account" className="text-[#FF7070] font-medium ml-1">
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}
