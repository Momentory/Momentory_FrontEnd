import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import type { CommunityUserProfile } from "../../api/community";
import { uploadFile } from "../../api/S3";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CommunityUserProfile;
  onSave: (data: {
    nickName?: string;
    bio?: string;
    externalLink?: string;
    imageName?: string;
    imageUrl?: string;
    backgroundImageName?: string;
    backgroundImageUrl?: string;
  }) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const [nickname, setNickname] = useState(profile.nickname || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [externalLink, setExternalLink] = useState(profile.externalLink || "");
  const [profileImageData, setProfileImageData] = useState<{ name: string; url: string } | null>(null);
  const [backgroundImageData, setBackgroundImageData] = useState<{ name: string; url: string } | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // 프로필 데이터 변경 시 초기화
  useEffect(() => {
    setNickname(profile.nickname || "");
    setBio(profile.bio || "");
    setExternalLink(profile.externalLink || "");
    setProfileImageData(null);
    setBackgroundImageData(null);
    setProfilePreview(null);
    setBackgroundPreview(null);
  }, [profile]);

  // 프로필 이미지 선택 및 S3 업로드
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setProfilePreview(URL.createObjectURL(file));

      // S3에 업로드
      const uploadResult = await uploadFile(file);
      setProfileImageData({
        name: uploadResult.result.imageName,
        url: uploadResult.result.imageUrl,
      });

    } catch (error) {
      console.error('❌ 프로필 이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
      setProfilePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // 배경 이미지 선택 및 S3 업로드
  const handleBackgroundImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setBackgroundPreview(URL.createObjectURL(file));

      // S3에 업로드
      const uploadResult = await uploadFile(file);
      setBackgroundImageData({
        name: uploadResult.result.imageName,
        url: uploadResult.result.imageUrl,
      });

    } catch (error) {
      console.error('❌ 배경 이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
      setBackgroundPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // 저장
  const handleSave = async () => {
    if (isUploading) {
      alert('이미지 업로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const updateData: any = {};

      // 변경된 항목만 전송 (백엔드 스펙에 맞춰 nickName으로 전송)
      if (nickname !== profile.nickname) updateData.nickName = nickname;
      if (bio !== profile.bio) updateData.bio = bio;
      if (externalLink !== profile.externalLink) updateData.externalLink = externalLink;

      // S3에 업로드된 이미지 정보 전송
      if (profileImageData) {
        updateData.imageName = profileImageData.name;
        updateData.imageUrl = profileImageData.url;
      }
      if (backgroundImageData) {
        updateData.backgroundImageName = backgroundImageData.name;
        updateData.backgroundImageUrl = backgroundImageData.url;
      }

      await onSave(updateData);
      onClose();
    } catch (error) {
      console.error("프로필 저장 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-[480px] mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-gray-800">프로필 수정</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-5 space-y-6">
          {/* 배경 이미지 */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              배경 이미지
            </label>
            <div
              className="relative w-full h-[140px] bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => backgroundInputRef.current?.click()}
            >
              <img
                src={backgroundPreview || profile.backgroundImageUrl || "/images/city.png"}
                alt="배경"
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[13px] font-medium">이미지 변경</span>
              </div>
            </div>
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundImageChange}
            />
          </div>

          {/* 프로필 이미지 */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              프로필 이미지
            </label>
            <div className="flex items-center gap-4">
              <div
                className="relative w-[100px] h-[100px] rounded-full overflow-hidden cursor-pointer group"
                onClick={() => profileInputRef.current?.click()}
              >
                <img
                  src={profilePreview || profile.imageUrl || "/images/profile.png"}
                  alt="프로필"
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className="text-[13px] text-[#FF7070] font-medium hover:underline"
              >
                이미지 변경
              </button>
            </div>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7070] focus:border-transparent"
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
            <p className="text-[12px] text-gray-500 mt-1">{nickname.length}/20</p>
          </div>

          {/* 소개글 */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              소개글
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7070] focus:border-transparent resize-none"
              placeholder="자신을 소개하는 글을 작성해주세요"
              rows={4}
              maxLength={150}
            />
            <p className="text-[12px] text-gray-500 mt-1">{bio.length}/150</p>
          </div>

          {/* 링크 */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              링크
            </label>
            <input
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7070] focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={isSaving || isUploading}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-[#FF7070] text-white rounded-lg font-medium hover:bg-[#FF5050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving || isUploading}
          >
            {isUploading ? "업로드 중..." : isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
