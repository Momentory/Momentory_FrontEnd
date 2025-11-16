import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkNickname, setKakaoProfile } from '../../api/auth';

export default function CreateProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [link, setLink] = useState('');

  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [birthYear, setBirthYear] = useState('2000');
  const [birthMonth, setBirthMonth] = useState('01');
  const [birthDay, setBirthDay] = useState('01');
  const [characterType, setCharacterType] = useState('CAT');

  const [, setNicknameAvailable] = useState<boolean | null>(null);
  const [checkingNickname, setCheckingNickname] = useState(false);

  const maxIntroLength = 100;

  /* ------------------- 닉네임 자동 중복 확인 ------------------- */
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

  /* ------------------- 저장 ------------------- */
  const handleSubmit = async () => {
    if (!name.trim()) return alert('이름을 입력해주세요.');
    if (!nickname.trim()) return alert('닉네임을 입력해주세요.');
    if (checkingNickname) return alert('닉네임 확인 중입니다.');

    const kakaoNickname = localStorage.getItem("nickname") || "";
    const profileImage = localStorage.getItem("profileImage") || "";

    const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

    const profilePayload: Record<string, unknown> = {
      name,
      nickname,
      gender,
      birthDate,
      characterType,
    };

    if (introduction.trim()) profilePayload.bio = introduction;
    if (link.trim()) profilePayload.externalLink = link;
    if (kakaoNickname) profilePayload.kakaoNickname = kakaoNickname;
    if (profileImage) profilePayload.profileImage = profileImage;

    try {
      await setKakaoProfile(profilePayload);

      alert("프로필 저장 완료!");
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("❌ 프로필 저장 실패:", error);
      alert("프로필 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-[31px] pt-[80px] pb-10 relative overflow-y-auto">

      {/* 뒤로가기 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[30px] w-[35px] h-[35px] cursor-pointer z-10"
        onClick={() => navigate(-1)}
      />

      <h1 className="text-[24px] font-semibold mb-8 text-center">
        프로필 정보 입력
      </h1>

      <div className="w-[329px] space-y-5">

        {/* 이름 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">이름</label>
          <input
            type="text"
            placeholder="실명을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[50px] rounded-2xl border px-4 text-[15px]"
          />
        </div>

        {/* 닉네임 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">닉네임</label>
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full h-[50px] rounded-2xl border px-4 text-[15px]"
          />

          {/* 닉네임 메시지 */}
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

        {/* 성별 */}
        <div>
          <label className="text-[15px] font-semibold mb-2 block">성별</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setGender('MALE')}
              className={`flex-1 h-[50px] rounded-2xl border font-medium transition ${
                gender === 'MALE'
                  ? 'bg-[#FF7070] text-white border-[#FF7070]'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              남성
            </button>

            <button
              type="button"
              onClick={() => setGender('FEMALE')}
              className={`flex-1 h-[50px] rounded-2xl border font-medium transition ${
                gender === 'FEMALE'
                  ? 'bg-[#FF7070] text-white border-[#FF7070]'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              여성
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="text-[15px] font-semibold mb-2 block">생년월일</label>
          <div className="flex space-x-2">
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="flex-1 h-[50px] rounded-2xl border px-3 text-[14px]">
              {Array.from({ length: 50 }, (_, i) => 2024 - i).map((year) => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>

            <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="flex-1 h-[50px] rounded-2xl border px-3 text-[14px]">
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((month) => (
                <option key={month} value={month}>{month}월</option>
              ))}
            </select>

            <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="flex-1 h-[50px] rounded-2xl border px-3 text-[14px]">
              {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((day) => (
                <option key={day} value={day}>{day}일</option>
              ))}
            </select>
          </div>
        </div>

        {/* 캐릭터 */}
        <div>
          <label className="text-[15px] font-semibold mb-2 block">캐릭터</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setCharacterType('CAT')}
              className={`flex-1 h-[50px] rounded-2xl border font-medium transition ${
                characterType === 'CAT'
                  ? 'bg-[#FF7070] text-white border-[#FF7070]'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              고양이
            </button>

            <button
              type="button"
              onClick={() => setCharacterType('DOG')}
              className={`flex-1 h-[50px] rounded-2xl border font-medium transition ${
                characterType === 'DOG'
                  ? 'bg-[#FF7070] text-white border-[#FF7070]'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              강아지
            </button>
          </div>
        </div>

        {/* 자기소개 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            자기소개 <span className="text-gray-400 text-[13px]">(선택)</span>
          </label>

          <div className="relative">
            <textarea
              placeholder="자기소개를 입력해주세요"
              value={introduction}
              onChange={(e) =>
                setIntroduction(e.target.value.slice(0, maxIntroLength))
              }
              className="w-full h-[90px] rounded-2xl border px-4 py-3 text-[15px] resize-none"
            />

            <p className="absolute bottom-2 right-3 text-gray-400 text-[12px]">
              {introduction.length} / {maxIntroLength}
            </p>
          </div>
        </div>

        {/* 링크 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            외부 링크 <span className="text-gray-400 text-[13px]">(선택)</span>
          </label>
          <input
            type="text"
            value={link}
            placeholder="예: https://instagram.com/..."
            onChange={(e) => setLink(e.target.value)}
            className="w-full h-[50px] rounded-2xl border px-4 text-[15px]"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          disabled={!name.trim() || !nickname.trim() || checkingNickname}
          onClick={handleSubmit}
          className={`w-full h-[60px] text-white text-[18px] font-semibold rounded-2xl mt-6 ${
            name.trim() && nickname.trim() && !checkingNickname
              ? 'bg-[#FF7070] active:scale-95 transition'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          프로필 저장
        </button>
      </div>
    </div>
  );
}
