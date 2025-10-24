import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">
      {/* 🔹 상단 화살표 + 타이틀 */}
      <div className="relative w-full max-w-[346px]">
        {/* 뒤로가기 화살표 */}
        <img
          src="/images/109618.png" // 🔸 public/images 폴더에 넣기
          alt="뒤로가기"
          className="absolute top-[25px] left-[30px] w-[35px] h-[35px] cursor-pointer"
          onClick={() => navigate("/login")} // 🔙 로그인 화면으로 이동
        />
        <h1 className="text-[28px] font-semibold text-black text-center mt-[25px]">
          Sign in
        </h1>
      </div>

      {/* 🔹 입력 폼 */}
      <form className="flex flex-col w-full max-w-[346px] space-y-4 mt-[80px]">
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-[10px] px-4 py-3 text-[15px] placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-[10px] px-4 py-3 text-[15px] placeholder-gray-400"
        />
      </form>

      {/* 🔹 로그인 버튼 */}
      <button
        type="submit"
        className="w-[346px] h-[70px] bg-[#FF7070] text-white text-[18px] font-semibold rounded-[25px] mt-[50px] active:scale-95 transition"
      >
        Sign in
      </button>

      {/* 🔹 하단 링크 */}
      <div className="text-gray-400 text-[13px] mt-4">
        아이디 찾기&nbsp;&nbsp;|&nbsp;&nbsp;비밀번호 찾기
      </div>
    </div>
  );
}
