import { useNavigate } from "react-router-dom";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen">
      {/* 상단바 */}
      <div className="relative flex items-center justify-center px-5 py-4 bg-white">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[28px] h-[28px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[25px] font-semibold text-gray-800">프로필 수정</h1>
      </div>

      {/* 프로필 이미지 영역 */}
      <div className="flex flex-col items-center mt-10 mb-8">
        <div className="relative">
          <img
            src="/images/profile.png"
            alt="프로필 이미지"
            className="w-[150px] h-[150px] rounded-full bg-gray-200"
          />
          <img
            src="/images/pencil.png"
            alt="프로필 수정 아이콘"
            className="absolute bottom-1 right-1 w-[24px] h-[24px] bg-white rounded-full p-[4px] shadow cursor-pointer"
          />
        </div>
        <p className="mt-3 text-[27px] font-semibold text-gray-800">닉네임</p>
      </div>

      {/* 입력 폼 */}
      <div className="px-6">
        {/* 닉네임 */}
        <div className="mb-5">
          <label className="block text-[25px] text-black-400 mb-2">닉네임</label>
          <div className="relative">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              className="w-full border border-gray-300 rounded-full px-10 py-5 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF7070]"
            />
            <img
              src="/images/user-icon.png"
              alt="닉네임 아이콘"
              className="absolute top-[13px] left-[12px] w-[18px] h-[18px] opacity-70"
            />
          </div>
        </div>

        {/* 프로필 소개 */}
        <div className="mb-5">
          <label className="block text-[25px] text-black-400 mb-2">프로필 소개</label>
          <div className="relative">
            <textarea
              placeholder="나에 대해서 소개해주세요.."
              maxLength={100}
              className="w-full h-[152px] border border-gray-300 rounded-2xl px-10 py-5 text-[15px] placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#FF7070]"
            ></textarea>
            <img
              src="/images/pencil-icon.png"
              alt="프로필 소개 아이콘"
              className="absolute top-[13px] left-[12px] w-[17px] h-[17px] opacity-70"
            />
          </div>
          <p className="text-right text-[12px] text-gray-400 mt-1">0 / 100</p>
        </div>

        {/* 외부 링크 */}
        <div className="mb-10">
          <label className="block text-[25px] text-black-400 mb-2">외부 링크</label>
          <div className="relative">
            <input
              type="text"
              placeholder="외부 링크를 추가해주세요"
              className="w-full border border-gray-300 rounded-full px-10 py-5 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF7070]"
            />
            <img
              src="/images/link-icon.png"
              alt="링크 아이콘"
              className="absolute top-[13px] left-[12px] w-[17px] h-[17px] opacity-70"
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={() => alert("저장 완료!")}
          className="w-full bg-[#FF7070] text-white text-[22px] font-semibold py-4 rounded-full active:scale-[0.98] transition mb-[20px]"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
