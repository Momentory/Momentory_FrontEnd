import { Link } from "react-router-dom";

export default function SigninScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-6 left-4 text-5xl cursor-pointer">
        <Link to="/login">←</Link>
      </div>

      {/* 로그인 박스 */}
      <div className="w-[330px] flex flex-col items-center border-transparent">
        <h1 className="text-[28px] font-bold mb-8">Sign in</h1>

        {/* 이메일 입력 */}
        <input
          type="email"
          placeholder="이메일"
          className="w-full h-[60px] rounded-[20px] border border-gray-300 mb-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full h-[60px] rounded-[20px] border border-gray-300 mb-6 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />

        {/* 로그인 버튼 */}
        <button className="w-full h-[70px] bg-[#FF7070] text-white text-[16px] font-medium rounded-[25px] mb-3 active:scale-95 transition">
          로그인
        </button>

        {/* 아이디/비밀번호 찾기 */}
        <div className="text-gray-400 text-sm">
          <span className="cursor-pointer hover:underline">아이디 찾기</span>
          <span className="mx-2">|</span>
          <span className="cursor-pointer hover:underline">비밀번호 찾기</span>
        </div>
      </div>
    </div>
  );
}
