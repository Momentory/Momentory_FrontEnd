import { useNavigate } from "react-router-dom";

export default function AccountCreatedPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-between h-screen bg-white px-[30px] overflow-hidden">
      {/* 뒤로가기 버튼 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[25px] w-[30px] h-[30px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* 상단 텍스트 */}
      <div className="flex flex-col items-start text-left mt-[120px] w-full">
        <h1 className="text-[30px] font-semibold text-black leading-none mb-[8px]">
          계정 생성 완료!
        </h1>
        <p className="text-[14px] text-gray-400 leading-none">
          Momentory에 오신 것을 환영합니다
        </p>
      </div>

      {/* 중간 콘텐츠 (체크 + 캐릭터) */}
      <div className="relative flex flex-col items-center justify-center mt-[100px]">
        {/* 체크 아이콘 */}
        <img
          src="/images/check.png"
          alt="체크"
          className="w-[113px] h-[113px] object-contain mb-[-60px] z-10"
        />

        {/* 캐릭터 이미지 (하나) */}
        <img
          src="/images/account.png"
          alt="캐릭터"
          className="w-[358px] h-[188px] object-contain mt-[60px]"
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex flex-col items-center gap-3 mb-[80px]">
        {/* Momentory 시작하기 */}
        <button
          onClick={() => navigate("/home")}
          className="w-[320px] h-[60px] bg-[#FF7070] text-white text-[18px] font-semibold rounded-[25px] active:scale-95 transition"
        >
          Momentory 시작하기
        </button>

        {/* 로그인으로 이동 */}
        <button
          onClick={() => navigate("/login")}
          className="w-[320px] h-[60px] bg-[#EDEDED] text-gray-400 text-[18px] font-medium rounded-[25px] active:scale-95 transition"
        >
          로그인으로 이동
        </button>
      </div>
    </div>
  );
}
