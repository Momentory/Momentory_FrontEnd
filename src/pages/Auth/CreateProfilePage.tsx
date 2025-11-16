import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreateProfilePage() {
  const navigate = useNavigate();

  // 이전 페이지에서 받은 데이터
  const location = useLocation();
  const accountData = location.state;

  /* ---------------------------- 상태 ---------------------------- */
  const [nickname, setNickname] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [link, setLink] = useState("");

  const maxIntroLength = 100;

  /* ------------------------ 저장해서 캐릭터 선택으로 이동 ------------------------ */
  const handleSubmit = () => {
    if (!nickname.trim()) return alert("닉네임을 입력해주세요.");

    navigate("/select", {
      state: {
        ...accountData,
        nickname,
        introduction,
        link,
      },
    });
  };

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white relative overflow-y-auto flex flex-col">

      {/* 뒤로가기 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[30px] w-[35px] h-[35px] cursor-pointer z-10"
        onClick={() => navigate(-1)}
      />

      {/* 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center px-[31px] pt-[80px] pb-[40px]">

        {/* 타이틀 */}
        <h1 className="text-[29px] font-semibold mb-8 text-center">
          프로필을 생성하세요
        </h1>

        {/* 프로필 이미지 */}
        <div className="relative w-[120px] h-[120px] mb-6">
          <div className="w-full h-full bg-[#EADCDC] rounded-full flex items-center justify-center">
            <img
              src="/images/profile.png"
              alt="프로필"
              className="w-[120px] h-[120px] opacity-70"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-white w-[30px] h-[30px] rounded-full shadow flex items-center justify-center cursor-pointer">
            <img
              src="/images/edit-icon.png"
              alt="프로필 수정"
              className="w-[15px] h-[15px]"
            />
          </div>
        </div>

        {/* 닉네임 섹션 */}
        <div className="flex flex-col items-center mb-6 w-full">
          <p className="text-[29px] font-semibold text-black mb-3">닉네임</p>
          <div className="w-full h-[2px] bg-gray-300" />
        </div>

        {/* 닉네임 입력 */}
        <div className="w-full flex flex-col space-y-1 mb-6">
          <label className="text-[15px] font-semibold mb-1 block">닉네임</label>

          <div className="relative">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-[50px] rounded-2xl border px-10 text-[15px]"
            />
            <img
              src="/images/user-icon.png"
              className="absolute left-3 top-4 w-[18px] h-[18px] opacity-60"
            />
          </div>

          {nickname.trim() !== "" && (
            <p className="text-green-500 text-[13px] mt-1">
              사용 가능한 닉네임입니다
            </p>
          )}
        </div>

        {/* 자기소개 */}
        <div className="w-full flex flex-col space-y-1 mb-6">
          <label className="text-[15px] font-semibold mb-1 block">자기 소개</label>
          <div className="relative">
            <textarea
              placeholder="자기 소개를 입력해주세요."
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value.slice(0, maxIntroLength))}
              className="w-full h-[90px] rounded-2xl border px-10 py-3 text-[15px] resize-none"
            />
            <img
              src="/images/pencil-icon.png"
              className="absolute left-3 top-3 w-[16px] h-[16px] opacity-60"
            />
            <p className="absolute bottom-2 right-3 text-gray-400 text-[12px]">
              {introduction.length} / {maxIntroLength}
            </p>
          </div>
        </div>

        {/* 외부 링크 */}
        <div className="w-full flex flex-col space-y-1 mb-8">
          <label className="text-[15px] font-semibold mb-1 block">외부 링크</label>
          <div className="relative">
            <input
              type="text"
              value={link}
              placeholder="예: https://instagram.com/..."
              onChange={(e) => setLink(e.target.value)}
              className="w-full h-[50px] rounded-2xl border px-10 text-[15px]"
            />
            <img
              src="/images/link-icon.png"
              className="absolute left-3 top-4 w-[16px] h-[16px] opacity-60 rotate-45"
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          disabled={nickname.trim() === ""}
          onClick={handleSubmit}
          className={`w-full h-[60px] text-white text-[18px] font-semibold rounded-2xl mt-auto ${
            nickname.trim() !== ""
              ? "bg-[#FF7070]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          프로필 저장
        </button>

      </div>
    </div>
  );
}
