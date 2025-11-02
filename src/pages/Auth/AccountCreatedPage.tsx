import { useNavigate } from "react-router-dom";

export default function AccountCreatedPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white px-[30px]">
      {/* 뒤로가기 버튼 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[25px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* 상단 텍스트 */}
      <div className="flex flex-col items-center text-center mt-[-80px] mb-[30px]">
        <h1 className="text-[26px] font-bold text-[#FF7070] mb-2">
          계정이 생성되었습니다!
        </h1>
        <p className="text-gray-500 text-[15px]">
          Momentory에 오신 걸 진심으로 환영합니다
        </p>
      </div>

      {/* 캐릭터 이미지 + 체크 아이콘 */}
      <div className="relative flex flex-col items-center mb-[-10px]">
        {/* 캐릭터 하나만 */}
        <img
          src="/images/account.png" // 첫 번째 첨부 캐릭터 이미지
          alt="캐릭터"
          className="w-[260px] h-[280px] object-contain"
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-[320px] h-[60px] bg-[#FF7070] text-white text-[18px] font-semibold rounded-[25px] active:scale-95 transition"
        >
          Momentory 시작하기
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-[320px] h-[60px] border border-gray-300 text-gray-600 text-[16px] font-medium rounded-[25px] active:scale-95 transition"
        >
          로그인으로 이동
        </button>
      </div>
    </div>
  );
}
