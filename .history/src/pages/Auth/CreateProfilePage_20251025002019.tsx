import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [link, setLink] = useState("");
  const maxIntroLength = 100;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-[31px] pt-[118px] relative">
      {/* 뒤로가기 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[30px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* 타이틀 */}
      <h1 className="text-[22px] font-semibold mb-6 text-center">
        Create Your Profile
      </h1>

      {/* 프로필 이미지 */}
      <div className="relative w-[120px] h-[120px] mb-4">
        <div className="w-full h-full bg-[#EADCDC] rounded-full flex items-center justify-center">
          <img
            src="/images/profile-default.png" // 기본 프로필 이미지
            alt="프로필"
            className="w-[70px] h-[70px] opacity-70"
          />
        </div>
        {/* 연필 아이콘 */}
        <div className="absolute bottom-0 right-0 bg-white w-[30px] h-[30px] rounded-full shadow flex items-center justify-center">
          <img
            src="/images/edit-icon.png"
            alt="프로필 수정"
            className="w-[15px] h-[15px]"
          />
        </div>
      </div>

      {/* 닉네임 텍스트 */}
      <p className="text-[18px] font-semibold text-black mb-4">닉네임</p>

      {/* 구분선 */}
      <div className="w-full border-t border-gray-300 mb-6"></div>

      {/* 입력 영역 */}
      <div className="w-[329px] flex flex-col space-y-4">
        {/* 닉네임 입력 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
           닉네임
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-[50px] rounded-[10px] border border-gray-300 px-10 text-[15px] placeholder-gray-400"
            />
            <img
              src="/images/user-icon.png"
              alt="닉네임 아이콘"
              className="absolute left-3 top-3 w-[18px] h-[18px] opacity-60"
            />
          </div>
        </div>

        {/* 자기소개 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            자기 소개
          </label>
          <div className="relative">
            <textarea
              placeholder="자기 소개를 써주세요."
              value={introduction}
              onChange={(e) =>
                setIntroduction(
                  e.target.value.slice(0, maxIntroLength)
                )
              }
              className="w-full h-[90px] rounded-[10px] border border-gray-300 px-10 py-2 text-[15px] placeholder-gray-400 resize-none"
            />
            <img
              src="/images/pencil-icon.png"
              alt="소개 아이콘"
              className="absolute left-3 top-3 w-[16px] h-[16px] opacity-60"
            />
            <p className="absolute bottom-2 right-3 text-gray-400 text-[12px]">
              {introduction.length} / {maxIntroLength}
            </p>
          </div>
        </div>

        {/* 외부 링크 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            외부 링크
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="외부 링크"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full h-[50px] rounded-[10px] border border-gray-300 px-10 text-[15px] placeholder-gray-400"
            />
            <img
              src="/images/link-icon.png"
              alt="링크 아이콘"
              className="absolute left-3 top-3 w-[16px] h-[16px] opacity-60"
            />
          </div>
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <button
        className="w-[329px] h-[60px] bg-[#FF7070] text-white text-[18px] font-semibold rounded-[20px] mt-8 active:scale-95 transition"
        onClick={() => navigate("/select")}
      >
        회원가입
      </button>
    </div>
  );
}
