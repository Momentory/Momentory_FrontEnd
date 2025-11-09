import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkNickname } from '../../api/auth';

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [link, setLink] = useState('');
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingNickname, setCheckingNickname] = useState(false);
  const maxIntroLength = 100;

  //  닉네임 변경 시 자동 중복 확인 (디바운스 0.5초)
  useEffect(() => {
    if (!nickname.trim()) {
      setNicknameAvailable(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setCheckingNickname(true);
      try {
        const res = await checkNickname(nickname);
        console.log("닉네임 중복확인 응답:", res);
        setNicknameAvailable(res.available);

      } catch (error) {
        console.error('닉네임 중복확인 실패:', error);
        setNicknameAvailable(null);
      } finally {
        // 여기 반드시 필요!
        setCheckingNickname(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [nickname]);


  // 회원가입 버튼 클릭
  const handleSubmit = () => {
    if (!nickname.trim()) return alert('닉네임을 입력해주세요.');
    if (checkingNickname)
      return alert('닉네임 중복 확인 중입니다. 잠시만 기다려주세요.');
    if (nicknameAvailable === false)
      return alert('이미 사용 중인 닉네임입니다.');

    alert('프로필이 저장되었습니다!');
    navigate('/select');
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
      <h1 className="text-[22px] font-semibold mb-6 text-center">
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

      {/* 닉네임 입력 */}
      <div className="w-[329px] flex flex-col space-y-1 mb-6">
        <label className="text-[15px] font-semibold mb-1 block">닉네임</label>
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

        {/* 닉네임 상태 메시지 */}
        {checkingNickname ? (
          <p className="text-gray-400 text-[13px] mt-1 animate-pulse">
            닉네임 중복 확인 중...
          </p>
        ) : nicknameAvailable === true ? (
          <p className="text-green-500 text-[13px] mt-1">
            사용 가능한 닉네임입니다 ✅
          </p>
        ) : nicknameAvailable === false ? (
          <p className="text-red-500 text-[13px] mt-1">
            이미 사용 중인 닉네임입니다 ❌
          </p>
        ) : null}
      </div>

      {/* 자기소개 */}
      <div className="w-[329px] flex flex-col space-y-1 mb-4">
        <label className="text-[15px] font-semibold mb-1 block">
          자기 소개
        </label>
        <div className="relative">
          <textarea
            placeholder="자기 소개를 써주세요."
            value={introduction}
            onChange={(e) =>
              setIntroduction(e.target.value.slice(0, maxIntroLength))
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
      <div className="w-[329px] flex flex-col space-y-1">
        <label className="text-[15px] font-semibold mb-1 block">
          외부 링크
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="예: https://instagram.com/..."
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

      {/* 회원가입 버튼 */}
      <button
        disabled={!nicknameAvailable || checkingNickname}
        onClick={handleSubmit}
        className={`w-[329px] h-[60px] text-white text-[18px] font-semibold rounded-[20px] mt-8 active:scale-95 transition ${nicknameAvailable && !checkingNickname
          ? "bg-[#FF7070]"
          : "bg-gray-300 cursor-not-allowed"
          }`}
      >
        {checkingNickname
          ? "확인 중..."
          : nicknameAvailable
            ? "회원가입 완료"
            : "회원가입 불가"}

      </button>

      {/* 임시 이동 버튼 */}
      <button
        type="button"
        onClick={() => navigate('/select')}
        className="w-[329px] h-[60px] bg-[#FF7070] text-white text-[18px] font-semibold rounded-[20px] mt-4 active:scale-95 transition"
      >
        (임시) 다음으로 →
      </button>
    </div>
  );
}
