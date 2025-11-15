// src/pages/community-page/UserProfilePage.tsx

import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getUserProfile,
  toggleFollowUser,
  getUserPosts,
} from "../../api/community";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = Number(userId);

  const queryClient = useQueryClient();

  /* ------------------------------- UI 상태 ------------------------------- */
  const [activeTab, setActiveTab] = useState<"posts" | "albums">("posts");
  const [backgroundImage, setBackgroundImage] = useState("/images/city.png");
  const bgInputRef = useRef<HTMLInputElement | null>(null);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  /* ------------------------------- API 호출 ------------------------------- */

  // 사용자 프로필 조회
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["userProfile", numericUserId],
    queryFn: () => getUserProfile(numericUserId),
    enabled: !!numericUserId,
  });

  // 사용자 게시물 조회
  const {
    data: userPosts,
    isLoading: isPostsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["userPosts", numericUserId],
    queryFn: () => getUserPosts(numericUserId),
    enabled: !!numericUserId,
  });

  /* ------------------------------- 팔로우 ------------------------------- */

  const followMutation = useMutation({
    mutationFn: () => toggleFollowUser(numericUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", numericUserId] });
    },
    onError: () => {
      alert("팔로우 처리 중 오류가 발생했습니다.");
    },
  });

  /* ------------------------------ 로딩/에러 처리 ------------------------------ */

  const isLoading = isProfileLoading || isPostsLoading;
  const isError = profileError || postsError;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  /* ------------------------------ 렌더링 ------------------------------ */

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center">
      {/* 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white w-full max-w-[480px] px-5 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
      </header>

      {/* 타이틀 */}
      <div className="relative bg-white border-b border-gray-200 h-[55px] flex items-center justify-center w-full max-w-[480px] mt-5">
        <img
          src="/images/109618.png"
          className="absolute left-[20px] w-[26px] h-[26px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[25px] font-semibold text-gray-800">
          {userProfile.nickname}
        </h1>
      </div>

      {/* 배경 이미지 */}
      <div
        className="relative w-full max-w-[480px] h-[180px] overflow-hidden cursor-pointer"
        onClick={() => bgInputRef.current?.click()}
      >
        <img
          src={backgroundImage}
          className="absolute w-full h-full object-cover brightness-[0.5]"
        />
        <input
          type="file"
          accept="image/*"
          ref={bgInputRef}
          className="hidden"
          onChange={handleBackgroundChange}
        />
      </div>

      {/* 프로필 */}
      <div className="w-full max-w-[480px] px-[15px] mt-[-35px] relative z-10 flex flex-col items-start">
        <img
          src={userProfile.profileImg || "/images/profile.png"}
          className="w-[80px] h-[80px] rounded-full object-cover shadow-md bg-white"
        />

        <div className="flex items-center justify-between w-full mt-[10px] pr-4">
          <h2 className="text-[17px] font-semibold text-gray-800">
            {userProfile.nickname}
          </h2>

          <button
            onClick={() => followMutation.mutate()}
            disabled={followMutation.isPending}
            className={`text-white text-[13px] px-4 py-[5px] rounded-full font-medium active:scale-95 transition ${
              userProfile.isFollowing ? "bg-gray-400" : "bg-[#FF7070]"
            }`}
          >
            {followMutation.isPending
              ? "처리 중..."
              : userProfile.isFollowing
              ? "팔로잉"
              : "팔로우"}
          </button>
        </div>

        {/* 카운트 */}
        <div className="flex items-center gap-6 mt-4">
          <p className="text-[9px] text-gray-700">
            <span className="font-semibold">{userProfile.followingCount}</span>{" "}
            팔로잉
          </p>
          <p className="text-[9px] text-gray-700">
            <span className="font-semibold">{userProfile.followerCount}</span>{" "}
            팔로워
          </p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex justify-center items-center gap-[120px] mt-[30px] mb-[2px]">
        <button
          onClick={() => setActiveTab("posts")}
          className={`transition ${
            activeTab === "posts" ? "opacity-100" : "opacity-40"
          }`}
        >
          <img src="/images/list.png" className="w-[25px] h-[25px]" />
        </button>

        {/* 앨범은 Swagger에 없으므로 '빈 탭' 처리 */}
        <button
          onClick={() => setActiveTab("albums")}
          className={`transition ${
            activeTab === "albums" ? "opacity-100" : "opacity-40"
          }`}
        >
          <img src="/images/mark.png" className="w-[25px] h-[25px]" />
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="grid grid-cols-3 gap-[4px] mt-[20px] px-2 w-full max-w-[480px] mb-[80px]">

        {/* 게시글 */}
        {activeTab === "posts" &&
          (userPosts && userPosts.length > 0 ? (
            userPosts.map((post: { postId: number; thumbnailUrl?: string; imageUrl?: string | null }) => (
              <div key={post.postId} className="aspect-square">
                <img
                  src={post.thumbnailUrl || post.imageUrl || "/images/default.png"}
                  className="w-full h-full object-cover rounded-[6px]"
                />
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500 mt-10">
              게시물이 없습니다.
            </p>
          ))}

        {/* 앨범 (Swagger에 없음 → 항상 비어있다고 처리) */}
        {activeTab === "albums" && (
          <p className="col-span-3 text-center text-gray-500 mt-10">
            앨범 기능은 준비 중입니다.
          </p>
        )}
      </div>
    </div>
  );
}
