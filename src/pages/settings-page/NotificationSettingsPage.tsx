import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationSettingsPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [marketingComm, setMarketingComm] = useState(false);
  const [marketingEmail, setMarketingEmail] = useState(true);

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen">
      {/* 상단바 */}
      <div className="relative flex items-center justify-center px-5 py-4 bg-white mb-[70px]">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[28px] h-[28px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[25px] font-semibold text-gray-800">알림</h1>
      </div>

      {/* 알림 설정 안내 */}
      <div className="px-6 mt-6">
        <h2 className="text-[20px] font-semibold text-black-800 mb-1">알림 설정</h2>
        <p className="text-[13px] text-gray-500 mb-5">
          알림을 받을 방법을 선택하세요.
        </p>

        {/* 마케팅 커뮤니케이션 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div>
            <p className="text-[20px] font-semibold text-black-800">
              마케팅 커뮤니케이션
            </p>
            <p className="text-[13px] text-gray-500">
              프로모션 및 업데이트 정보를 받습니다.
            </p>
          </div>
          {/* 스위치 */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={marketingComm}
              onChange={() => setMarketingComm(!marketingComm)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7070] transition-colors duration-200"></div>
            <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[22px]"></div>
          </label>
        </div>

        {/* 마케팅 이메일 */}
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-[20px] font-semibold text-black-800">마케팅 이메일</p>
            <p className="text-[13px] text-gray-500">
              새로운 기능, 팁, 혜택에 대한 정보를 받습니다.
            </p>
          </div>
          {/* 스위치 */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={marketingEmail}
              onChange={() => setMarketingEmail(!marketingEmail)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7070] transition-colors duration-200"></div>
            <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[22px]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
