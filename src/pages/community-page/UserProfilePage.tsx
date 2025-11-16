import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";

import {
  getCommunityUserProfile,
  getUserPosts,
  getUserLikes,
  getUserScraps,
  toggleFollowUser,
  updateUserProfile,
} from "../../api/community";
import EditProfileModal from "../../components/community/EditProfileModal";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = userId ? Number(userId) : undefined;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"posts" | "scraps" | "likes">("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /* -------------------- API (Hooks) -------------------- */
  const profileQuery = useQuery({
    queryKey: ["communityUserProfile", numericUserId],
    queryFn: () => getCommunityUserProfile(numericUserId),
    enabled: numericUserId !== undefined,
  });

  const postsQuery = useQuery({
    queryKey: ["userPosts", numericUserId],
    queryFn: () => getUserPosts(numericUserId),
    enabled: numericUserId !== undefined,
  });

  const scrapsQuery = useQuery({
    queryKey: ["userScraps", numericUserId],
    queryFn: () => getUserScraps(numericUserId),
    enabled: numericUserId !== undefined,
  });

  const likesQuery = useQuery({
    queryKey: ["userLikes", numericUserId],
    queryFn: () => getUserLikes(numericUserId),
    enabled: numericUserId !== undefined,
  });

  const followMutation = useMutation({
    mutationFn: () => {
      if (numericUserId === undefined) throw new Error("userId is required");
      return toggleFollowUser(numericUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityUserProfile", numericUserId],
      });
    },
  });

  /* -------------------- 데이터 정리 -------------------- */
  const userProfile = profileQuery.data;
  const userPosts = postsQuery.data?.posts || [];
  const userScraps = scrapsQuery.data?.posts || [];
  const userLikes = likesQuery.data?.posts || [];

  /* -------------------- 프로필 저장 -------------------- */
  const handleSaveProfile = async (data: any) => {
    try {
      await updateUserProfile(data);

      queryClient.invalidateQueries({
        queryKey: ["communityUserProfile", numericUserId],
      });
    } catch (error) {
      console.error("❌ 프로필 수정 실패:", error);
    }
  };

  /* =========================== 렌더링 =============================== */

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center mt-[60px]">
      {/* 공통 헤더 */}
      <div className="w-full max-w-[480px] bg-white h-[55px] border-b border-gray-200 flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 flex items-center justify-center"
        >
          <img src="/images/109618.png" className="w-[20px] h-[20px]" />
        </button>
        <span className="text-[20px] font-semibold text-gray-900">마이페이지</span>
      </div>

      {/* 로딩 */}
      {(profileQuery.isLoading || postsQuery.isLoading) ? (
        <div className="w-full h-[200px] flex items-center justify-center">로딩 중...</div>
      ) : (
        <>
          {/* 배경 */}
          <div className="relative w-full max-w-[480px] h-[180px] overflow-hidden">
            <img
              src={userProfile?.backgroundImageUrl || "/images/city.png"}
              className="absolute w-full h-full object-cover brightness-[0.5]"
            />
          </div>

          {/* 프로필 전체 */}
          <div className="w-full max-w-[480px] px-[15px] mt-[-35px] relative z-10">

            {/* 프로필 이미지 */}
            <img
              src={
                !userProfile?.imageUrl || userProfile.imageUrl === "string"
                  ? "/images/profile.png"
                  : userProfile.imageUrl
              }
              className="w-[80px] h-[80px] rounded-full bg-white object-cover shadow-md"
            />

            {/* 닉네임 + 버튼 */}
            <div className="flex items-center justify-between mt-3 pr-2">
              <h2 className="text-[17px] font-semibold text-gray-800">
                {userProfile?.nickname || "사용자"}
              </h2>

              {userProfile?.isMe ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-md"
                >
                  <Pencil size={18} className="text-gray-700" />
                </button>
              ) : (
                <button
                  onClick={() => followMutation.mutate()}
                  className={`text-white text-[13px] px-4 py-[5px] rounded-full font-medium shadow-md
                    ${userProfile?.isFollowing ? "bg-gray-400" : "bg-[#FF7070]"}`}
                >
                  {userProfile?.isFollowing ? "팔로잉" : "팔로우"}
                </button>
              )}
            </div>

            {/* 소개글 */}
            {userProfile?.bio && (
              <p className="text-[13px] text-gray-700 mt-2 w-[282px] leading-snug">
                {userProfile.bio}
              </p>
            )}

            {/* 링크 */}
            {userProfile?.externalLink && (
              <div className="flex items-center gap-2 mt-2">
                <img src="/images/link-icon.png" className="w-[14px] h-[14px] rotate-45" />
                <a
                  href={userProfile.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-blue-600 underline"
                >
                  {userProfile.externalLink}
                </a>
              </div>
            )}

            {/* 팔로잉/팔로워 */}
            <div className="flex items-center gap-6 mt-3 text-gray-700">
              <button
                onClick={() => navigate(`/community/${numericUserId}/followings`)}
                className="text-[12px] active:opacity-60"
              >
                <span className="font-semibold">{userProfile?.followingCount || 0}</span> 팔로잉
              </button>

              <button
                onClick={() => navigate(`/community/${numericUserId}/followers`)}
                className="text-[12px] active:opacity-60"
              >
                <span className="font-semibold">{userProfile?.followerCount || 0}</span> 팔로워
              </button>
            </div>
          </div>
          {/* 탭 */}
          <div className="flex justify-center items-center gap-[100px] mt-[30px] mb-[5px]">

            {/* 게시물 탭 */}
            <button onClick={() => setActiveTab("posts")}>
              <img
                src="/images/list.png"
                className={`w-[19px] h-[19px] transition
        ${activeTab === "posts"
                    ? "opacity-100"
                    : "[filter:brightness(0)_saturate(0)_opacity(0.4)]"}
                          `}
              />
            </button>

            {/* 스크랩 탭 */}
            <button onClick={() => setActiveTab("scraps")}>
              <img
                src="/images/mark.png"
                className={`w-[27px] h-[27px] transition
        ${activeTab === "scraps"
                    ? "opacity-100"
                    : "[filter:brightness(0)_saturate(0)_opacity(0.4)]"}
                         `}
              />
            </button>

            {/* 좋아요 탭 */}
            <button onClick={() => setActiveTab("likes")}>
              <img
                src="/images/Heart.png"
                className={`w-[27px] h-[27px] transition
        ${activeTab === "likes"
                    ? "opacity-100"
                    : "[filter:brightness(0)_saturate(0)_opacity(0.4)]"}
                          `}
              />
            </button>

          </div>



          {/* 탭 콘텐츠 */}
          <div className="grid grid-cols-3 gap-[4px] mt-[20px] px-2 w-full max-w-[480px] mb-[80px]">

            {/* 게시글 */}
            {activeTab === "posts" &&
              (userPosts.length > 0 ? (
                userPosts.map((p: any) => (
                  <div
                    key={p.postId}
                    className="aspect-square cursor-pointer active:scale-[0.98] transition"
                    onClick={() => navigate(`/community/${p.postId}`)}
                  >
                    <img
                      src={p.imageUrl || "/images/default.png"}
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500 mt-10">
                  게시물이 없습니다.
                </p>
              ))}

            {/* 스크랩 */}
            {activeTab === "scraps" &&
              (userScraps.length > 0 ? (
                userScraps.map((p: any) => (
                  <div
                    key={p.postId}
                    className="aspect-square cursor-pointer active:scale-[0.98] transition"
                    onClick={() => navigate(`/community/${p.postId}`)}
                  >
                    <img
                      src={p.imageUrl || "/images/default.png"}
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500 mt-10">
                  스크랩한 게시물이 없습니다.
                </p>
              ))}

            {/* 좋아요 */}
            {activeTab === "likes" &&
              (userLikes.length > 0 ? (
                userLikes.map((p: any) => (
                  <div
                    key={p.postId}
                    className="aspect-square cursor-pointer active:scale-[0.98] transition"
                    onClick={() => navigate(`/community/${p.postId}`)}
                  >
                    <img
                      src={p.imageUrl || "/images/default.png"}
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500 mt-10">
                  좋아요한 게시물이 없습니다.
                </p>
              ))}
          </div>
        </>
      )}

      {/* 프로필 수정 모달 */}
      {userProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={userProfile}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
