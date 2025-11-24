import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PrivacyDataPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen flex flex-col justify-between">
      {/* 상단바 */}
      <div>
        <div className="relative flex items-center justify-center px-5 py-4 bg-white">
          {/* 뒤로가기 버튼 */}
          <img
            src="/images/109618.png"
            alt="뒤로가기"
            className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[28px] h-[28px] cursor-pointer"
            onClick={() => navigate(-1)}
          />

          {/* 타이틀 */}
          <h1 className="text-[23px] font-semibold text-gray-800">
            개인정보 보호 및 데이터
          </h1>
        </div>

        {/* 본문 영역 */}
        <div className="px-6 mt-15">
          {/* 데이터 */}
          <div className="mb-4">
            <p className="text-[20px] font-semibold text-gray-800 mb-1">데이터</p>
            <p className="text-[13px] text-gray-500">사용자의 데이터를 관리하세요</p>
          </div>

          {/* 데이터 초기화 */}
          <div
            className="flex items-center justify-between py-4 border-t border-gray-200 cursor-pointer"
            onClick={() => alert("데이터 초기화 페이지로 이동")}
          >
            <div>
              <p className="text-[20px] font-semibold text-gray-800">
                데이터 초기화
              </p>
              <p className="text-[13px] text-gray-500">
                지금까지의 진행사항을 초기화합니다
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="px-6 mb-8">
        <button
          onClick={() => alert("저장 완료!")}
          className="w-full bg-[#FF7070] text-white text-[22px] font-semibold py-5 rounded-full shadow-md active:scale-[0.97] transition-all duration-150"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
