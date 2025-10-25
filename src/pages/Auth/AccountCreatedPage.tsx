import { useNavigate } from "react-router-dom";

export default function AccountCreatedPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white px-[30px]">
      {/*  뒤로가기 버튼 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[25px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/*  메시지 영역 */}
      <div className="flex flex-col items-center text-center mt-[-150px]">
       
        <h1 className="text-[26px] font-bold text-[#FF7070] mb-2">
          계정이 생성되었습니다!
        </h1>
        <p className="text-gray-500 text-[15px] mb-10">
          Momentory에 오신 걸 진심으로 환영합니다 
        </p>

        {/* 홈 이동 버튼 */}
        <button
          onClick={() => navigate("/home")} // 나중에 홈 페이지 경로로 변경
          className="w-[320px] h-[60px] bg-[#FF7070] text-white text-[18px] font-semibold rounded-[25px] active:scale-95 transition"
        >
          Momentory 시작하기
        </button>

        {/* (임시) 로그인으로 이동 버튼 */}
        <button
          onClick={() => navigate("/login")}
          className="w-[320px] h-[60px] border border-gray-300 text-gray-600 text-[16px] font-medium rounded-[25px] mt-4 active:scale-95 transition"
        >
          로그인으로 이동
        </button>
      </div>
    </div>
  );
}
