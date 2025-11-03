import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen">
      {/* 상단바 */}
      <div className="relative flex items-center justify-center px-5 py-4">
        {/* 뒤로가기 버튼 */}
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[30px] h-[30px] cursor-pointer"
          onClick={() => navigate(-1)}
        />

        {/* 타이틀 */}
        <h1 className="text-[25px] font-semibold text-gray-800">환경설정</h1>
      </div>

      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mt-10 mb-6">
        <img
          src="/images/profile.png"
          alt="프로필 이미지"
          className="w-[150px] h-[150px] rounded-full bg-gray-200"
        />
        <p className="mt-3 text-[27px] font-semibold text-black-800">닉네임</p>
      </div>

      {/* 설정 섹션 */}
      <div className="px-6 pb-8">
        {/* 설정 */}
        <p className="text-[18px] font-bold text-black-700 mb-2">설정</p>
        <div className="divide-y divide-gray-200">
          {["프로필 수정", "알림", "개인정보 보호 및 데이터"].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 cursor-pointer active:bg-gray-50"
              onClick={() => {
                if (item === "프로필 수정") navigate("/settings/profile-edit"); // 프로필 수정 클릭 시 이동
                else if (item === "알림") navigate("/settings/notifications");
                else if (item === "개인정보 보호 및 데이터") navigate("/settings/privacy-data");
                else console.log(item); // 다른 항목은 일단 콘솔로 확인
              }}
            >
              <span className="text-[15px] text-gray-700">{item}</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          ))}
        </div>

        {/* 지원 */}
        <p className="text-[18px] font-bold text-black-800 mt-6 mb-2">지원</p>
        <div className="divide-y divide-gray-200">
          {["서비스 약관", "개인정보처리방침"].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 cursor-pointer active:bg-gray-50"
              onClick={() => {
                if (item === "서비스 약관") navigate("/settings/terms-of-service");
                else if (item === "개인정보처리방침") navigate("/settings/privacy-policy");
              }}
            >
              <span className="text-[15px] text-gray-700">{item}</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          ))}
        </div>

        {/* 로그인 */}
        <p className="text-[18px] font-bold text-blakc-800 mt-6 mb-2">로그인</p>
        <div className="divide-y divide-gray-200">
          {["보안"].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 cursor-pointer active:bg-gray-50"
              onClick={() => {
                if (item === "보안") navigate("/settings/security");
              }}
            >
              <span className="text-[15px] text-gray-700">{item}</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          ))}
        </div>

        {/* 회원탈퇴 */}
        <div
          className="pt-4 text-[15px] text-[#FF7070] font-medium text-left cursor-pointer"
          onClick={() => navigate("/settings/withdraw")}
        >
          회원탈퇴
        </div>
      </div>
    </div>
  );
}
