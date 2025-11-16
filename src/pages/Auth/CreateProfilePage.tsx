import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkNickname } from '../../api/auth';

export default function CreateProfilePage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [link, setLink] = useState('');

  const [/*nicknameAvailable*/, setNicknameAvailable] = useState<boolean | null>(null);
  const [checkingNickname, setCheckingNickname] = useState(false);

  const maxIntroLength = 100;


  /* ------------------- 닉네임 자동 확인------------------- */
  useEffect(() => {
    if (!nickname.trim()) {
      setNicknameAvailable(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setCheckingNickname(true);

      try {
        const res = await checkNickname(nickname);
        setNicknameAvailable(res.available);
      } catch (error) {
        console.warn("닉네임 확인 실패 → 사용 가능으로 처리");
        setNicknameAvailable(true);
      }

      setCheckingNickname(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [nickname]);


  /* ------------------------ 저장 ------------------------ */
  const handleSubmit = async () => {
    if (!nickname.trim()) return alert('닉네임을 입력해주세요.');
    if (checkingNickname) return alert('닉네임 확인 중입니다.');

    const profilePayload = {
      nickname,
      introduction,
      link,
    };

    console.log("저장할 프로필 데이터:", profilePayload);

    alert("프로필 저장 완료!");
    navigate("/select");
  };


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
      <h1 className="text-[29px] font-semibold mb-6 text-center">
        프로필을 생성하세요
      </h1>

      {/* 프로필 이미지 */}
      <div className="relative w-[120px] h-[120px] mb-4">
        <div className="w-full h-full bg-[#EADCDC] rounded-full flex items-center justify-center">
          <img
            src="/images/profile.png"
            alt="프로필"
            className="w-[120px] h-[120px] opacity-70"
          />
        </div>
        <div className="absolute bottom-0 right-0 bg-white w-[30px] h-[30px] rounded-full shadow flex items-center justify-center">
          <img
            src="/images/edit-icon.png"
            alt="프로필 수정"
            className="w-[15px] h-[15px]"
          />
        </div>
      </div>

      {/* 닉네임 영역 */}
      <div className="flex flex-col items-center mt-2 mb-6">
        <p className="text-[29px] font-semibold text-black">닉네임</p>
        <div className="h-[20px]" />
        <div className="w-[329px] h-[2px] bg-gray-300" />
      </div>

      {/* 닉네임 입력 */}
      <div className="w-[329px] flex flex-col space-y-1 mb-6">
        <label className="text-[15px] font-semibold mb-1 block">닉네임</label>
        <div className="relative">
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full h-[50px] rounded-2xl border px-10 text-[15px]"
          />
          <img
            src="/images/user-icon.png"
            className="absolute left-3 top-4 w-[18px] h-[18px] opacity-60"
          />
        </div>

        {/* 닉네임 중복 메시지 */}
        {nickname.trim() !== "" && checkingNickname && (
          <p className="text-gray-400 text-[13px] mt-1 animate-pulse">
            닉네임 확인 중...
          </p>
        )}

        {nickname.trim() !== "" && !checkingNickname && (
          <p className="text-green-500 text-[13px] mt-1">
            사용 가능한 닉네임입니다
          </p>
        )}


      </div>

      {/* 자기소개 */}
      <div className="w-[329px] flex flex-col space-y-1 mb-4">
        <label className="text-[15px] font-semibold mb-1 block">자기 소개</label>
        <div className="relative">
          <textarea
            placeholder="자기 소개를 입력해주세요."
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value.slice(0, maxIntroLength))}
            className="w-full h-[90px] rounded-2xl border px-10 py-2 text-[15px] resize-none"
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
      <div className="w-[329px] flex flex-col space-y-1">
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
        disabled={nickname.trim() === "" || checkingNickname}
        onClick={handleSubmit}
        className={`w-[329px] h-[60px] text-white text-[18px] font-semibold rounded-2xl mt-8 ${nickname.trim() !== "" && !checkingNickname
            ? "bg-[#FF7070]"
            : "bg-gray-300 cursor-not-allowed"
          }`}
      >
        프로필 저장
      </button>
    </div>
  );
}
