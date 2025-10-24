import { useNavigate } from "react-router-dom";

export default function AccountCreatedPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white">
      {/* 뒤로가기 버튼 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[25px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/*  메시지 섹션 */}
      <div className="flex flex-col items-start text-left w-[80%] mt-[-100px]">
        <h1 className="text-[24px] font-semibold mb-1">계정이 생성되었습니다!</h1>
        <p className="text-gray-500 text-[14px]">Momentory에 오신 걸 환영합니다</p>
      </div>
    </div>
  );
}
