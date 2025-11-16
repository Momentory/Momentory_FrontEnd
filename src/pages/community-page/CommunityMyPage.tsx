import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import {
  getCommunityUserProfile,
  getUserPosts,
  getUserLikes,
  getUserScraps,
  updateUserProfile,
  type MyPostItem,
  type CommunityUserProfile,
} from "../../api/community";
import EditProfileModal from "../../components/community/EditProfileModal";

export default function CommunityMyPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<"list" | "scrap" | "like">("list");

  const backgroundInputRef = useRef<HTMLInputElement | null>(null);
  const profileInputRef = useRef<HTMLInputElement | null>(null);

  /* -------------------------------- API 데이터 상태 관리 ------------------------------- */
  const [profile, setProfile] = useState<CommunityUserProfile | null>(null);
  const [myPosts, setMyPosts] = useState<MyPostItem[]>([]);
  const [scrapPosts, setScrapPosts] = useState<MyPostItem[]>([]);
  const [likedPosts, setLikedPosts] = useState<MyPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /* -------------------------------- 데이터 불러오기 ------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const targetUserId = userId ? parseInt(userId) : undefined;

        console.log(targetUserId ? `사용자(${targetUserId}) 데이터 조회 중...` : '내 데이터 조회 중...');

        const [profileData, postsResult, scrapsResult, likesResult] = await Promise.all([
          getCommunityUserProfile(targetUserId),
          getUserPosts(targetUserId),
          getUserScraps(targetUserId),
          getUserLikes(targetUserId),
        ]);

        setProfile(profileData);
        setMyPosts(postsResult.posts);
        setScrapPosts(scrapsResult.posts);
        setLikedPosts(likesResult.posts);
      } catch (error) {
        console.error("❌ 데이터 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleBackgroundChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // TODO: S3 업로드 후 URL을 받아서 updateUserProfile 호출
      // const uploadResult = await uploadFile(file);
      // await updateUserProfile({
      //   backgroundImageName: uploadResult.result.imageName,
      //   backgroundImageUrl: uploadResult.result.imageUrl
      // });

      // 성공 시 프로필 데이터 새로고침
      // const updatedProfile = await getCommunityUserProfile();
      // setProfile(updatedProfile);

      console.warn('배경화면 변경 기능은 프로필 수정 모달을 이용해주세요.');
    } catch (error) {
      console.error('❌ 배경화면 변경 실패:', error);
      alert('배경화면 변경에 실패했습니다.');
    }
  };

  const handleBackgroundClick = () => {
    backgroundInputRef.current?.click();
  };

  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // TODO: S3 업로드 후 URL을 받아서 updateUserProfile 호출
      // const uploadResult = await uploadFile(file);
      // await updateUserProfile({
      //   imageName: uploadResult.result.imageName,
      //   imageUrl: uploadResult.result.imageUrl
      // });

      // 성공 시 프로필 데이터 새로고침
      // const updatedProfile = await getCommunityUserProfile();
      // setProfile(updatedProfile);

      console.warn('프로필 사진 변경 기능은 프로필 수정 모달을 이용해주세요.');
    } catch (error) {
      console.error('❌ 프로필 사진 변경 실패:', error);
      alert('프로필 사진 변경에 실패했습니다.');
    }
  };

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  // 프로필 수정 모달에서 저장
  const handleSaveProfile = async (data: {
    nickName?: string;
    bio?: string;
    externalLink?: string;
    imageName?: string;
    imageUrl?: string;
    backgroundImageName?: string;
    backgroundImageUrl?: string;
  }) => {
    try {
      console.log('프로필 수정 중...', data);

      // API 호출
      await updateUserProfile(data);

      // 성공 시 프로필 데이터 새로고침
      const updatedProfile = await getCommunityUserProfile();
      setProfile(updatedProfile);

      console.log('✅ 프로필 수정 완료');
    } catch (error) {
      console.error('❌ 프로필 수정 실패:', error);
      throw error;
    }
  };

  const currentPosts =
    activeTab === "list"
      ? myPosts
      : activeTab === "scrap"
        ? scrapPosts
        : likedPosts;

  /* -------------------------------- 상세 페이지 이동 함수------------------------------------- */
  const goToDetail = (postId: number) => {
    navigate(`/community/${postId}`);
  };

  /* ------------------------------렌더링 ------------------------------------------------------- */
  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center">

      {/* 상단 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white w-full max-w-[480px] px-5 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
      </header>

      {/* 타이틀 */}
      <div className="relative bg-white border-b border-gray-200 h-[55px] flex items-center justify-center w-full max-w-[480px] mt-5">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] w-[26px] h-[26px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[25px] font-semibold text-gray-800">마이페이지</h1>
      </div>

      {/* 배경 이미지 */}
      <div
        className={`relative w-full max-w-[480px] h-[180px] overflow-hidden ${profile?.isMe ? 'cursor-pointer group' : ''}`}
        onClick={profile?.isMe ? handleBackgroundClick : undefined}
      >
        <img
          src={profile?.backgroundImageUrl || "/images/city.png"}
          alt="배경"
          className={`absolute w-full h-full object-cover brightness-[0.45] transition-all duration-300 ${profile?.isMe ? 'group-hover:brightness-[0.35]' : ''}`}
        />

        {/* 변경 안내 (내 페이지에서만 표시) */}
        {profile?.isMe && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-white text-[15px] font-medium">
              배경화면 변경하기
            </span>
          </div>
        )}

        {profile?.isMe && (
          <input
            ref={backgroundInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBackgroundChange}
          />
        )}
      </div>

      {/* 프로필 */}
      <div className="w-full max-w-[480px] px-[15px] mt-[-35px] relative z-10">
        {/* 프로필 수정 버튼 - 우측 상단 */}
        {profile?.isMe && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-0 right-[15px] p-2 bg-white hover:bg-gray-50 rounded-full transition-colors shadow-md"
            aria-label="프로필 수정"
          >
            <Pencil size={18} className="text-gray-700" />
          </button>
        )}

        <div className="relative inline-block">
          <img
            src={profile?.imageUrl || "/images/profile.png"}
            alt="프로필"
            className={`w-[80px] h-[80px] rounded-full object-cover shadow-md border-white bg-white ${profile?.isMe ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
              }`}
            onClick={profile?.isMe ? handleProfileClick : undefined}
          />
          {profile?.isMe && (
            <div
              className="absolute bottom-0 right-0 w-[26px] h-[26px] bg-[#FF7070] rounded-full flex items-center justify-center cursor-pointer shadow-md"
              onClick={handleProfileClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          )}
        </div>

        {profile?.isMe && (
          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileChange}
          />
        )}

        <div className="mt-[8px]">
          <h2 className="text-[17px] font-semibold text-gray-800">
            {profile?.nickname || "사용자"}
          </h2>
          <p className="text-[13px] text-gray-500 w-[282px] leading-snug mt-1">
            {profile?.bio || ""}
          </p>

          {/* 링크 표시 */}
          {profile?.externalLink && (
            <div className="flex items-center gap-2 mt-2">
              <img
                src="/images/link-icon.png"
                className="w-[14px] h-[14px] rotate-45"
                alt="link"
              />
              <a
                href={profile.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-blue-600 underline hover:text-blue-700"
              >
                {profile.externalLink}
              </a>
            </div>
          )}

          <div className="flex gap-4 mt-2">
            {/* 팔로워 */}
            <button
              className="text-[13px] text-gray-600"
              onClick={() => navigate(`/community/${profile?.userId}/followers`)}
            >
              팔로워 <span className="font-semibold">{profile?.followerCount || 0}</span>
            </button>

            {/* 팔로잉 */}
            <button
              className="text-[13px] text-gray-600"
              onClick={() => navigate(`/community/${profile?.userId}/followings`)}
            >
              팔로잉 <span className="font-semibold">{profile?.followingCount || 0}</span>
            </button>
          </div>

        </div>

        {/* 아이콘 탭 */}
        <div className="flex justify-center items-center gap-[120px] mt-[40px] mb-[2px]">
          <button
            onClick={() => setActiveTab("list")}
            className={`${activeTab === "list" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/images/list.png" className="w-[19px] h-[19px]" />
          </button>

          <button
            onClick={() => setActiveTab("scrap")}
            className={`${activeTab === "scrap" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/images/mark.png" className="w-[27px] h-[27px]" />
          </button>

          <button
            onClick={() => setActiveTab("like")}
            className={`${activeTab === "like" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/images/Heart.png" className="w-[27px] h-[27px]" />
          </button>
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="grid grid-cols-3 gap-[4px] mt-[25px] px-2 w-full max-w-[480px]">
        {isLoading ? (
          <div className="col-span-3 text-center py-10 text-gray-500">
            로딩 중...
          </div>
        ) : currentPosts.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-gray-500">
            게시물이 없습니다.
          </div>
        ) : (
          currentPosts.map((post) => (
            <div
              key={post.postId}
              className="aspect-square cursor-pointer active:scale-[0.98] transition"
              onClick={() => goToDetail(post.postId)}
            >
              <img
                src={post.imageUrl}
                alt={`게시물 ${post.postId}`}
                className="w-full h-full object-cover rounded-[6px]"
              />
            </div>
          ))
        )}
      </div>

      {/* 프로필 수정 모달 */}
      {profile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
