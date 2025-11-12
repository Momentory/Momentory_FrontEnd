import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getMyProfile,
  updateProfile,
  uploadImage,
  type UserProfile,
} from "../../api/mypage";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [externalLink, setExternalLink] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setNickname(data.nickname);
        setBio(data.bio || "");
        setExternalLink(data.externalLink || "");
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        alert('프로필을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 크기는 10MB 이하여야 합니다.');
      return;
    }

    // 파일 형식 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setUploading(true);
    try {
      const { imageName, imageUrl } = await uploadImage(file);
      const updatedProfile = await updateProfile({ imageName, imageUrl });
      setProfile(updatedProfile);
      alert('프로필 이미지가 변경되었습니다.');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      const updatedProfile = await updateProfile({
        nickName: nickname,
        bio: bio || undefined,
        externalLink: externalLink || undefined,
      });
      setProfile(updatedProfile);
      alert('프로필이 저장되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

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
          {loading || uploading ? (
            <div className="w-[150px] h-[150px] rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <img
              src={profile?.imageUrl || "/images/profile.png"}
              alt="프로필 이미지"
              className="w-[150px] h-[150px] rounded-full bg-gray-200 object-cover"
            />
          )}
          <img
            src="/images/pencil.png"
            alt="프로필 수정 아이콘"
            className="absolute bottom-1 right-1 w-[24px] h-[24px] bg-white rounded-full p-[4px] shadow cursor-pointer"
            onClick={handleImageClick}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <p className="mt-3 text-[27px] font-semibold text-gray-800">
          {loading ? "로딩 중..." : nickname || "닉네임"}
        </p>
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
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={loading || saving}
              className="w-full border border-gray-300 rounded-full px-10 py-5 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF7070] disabled:bg-gray-100"
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
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading || saving}
              className="w-full h-[152px] border border-gray-300 rounded-2xl px-10 py-5 text-[15px] placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#FF7070] disabled:bg-gray-100"
            ></textarea>
            <img
              src="/images/pencil-icon.png"
              alt="프로필 소개 아이콘"
              className="absolute top-[13px] left-[12px] w-[17px] h-[17px] opacity-70"
            />
          </div>
          <p className="text-right text-[12px] text-gray-400 mt-1">{bio.length} / 100</p>
        </div>

        {/* 외부 링크 */}
        <div className="mb-10">
          <label className="block text-[25px] text-black-400 mb-2">외부 링크</label>
          <div className="relative">
            <input
              type="text"
              placeholder="외부 링크를 추가해주세요"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              disabled={loading || saving}
              className="w-full border border-gray-300 rounded-full px-10 py-5 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF7070] disabled:bg-gray-100"
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
          onClick={handleSave}
          disabled={loading || saving || uploading}
          className="w-full bg-[#FF7070] text-white text-[22px] font-semibold py-4 rounded-full active:scale-[0.98] transition mb-[20px] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
