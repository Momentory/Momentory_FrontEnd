// src/pages/community-page/UserProfilePage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getUserProfile,
  getUserPosts,
  toggleFollowUser,
  type CommunityPost,
} from "../../api/community";
import { initialCommunityPosts } from "./CommunityDummy";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = Number(userId);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] =
    useState<"posts" | "albums" | "likes">("posts");

  /* -------------------- API (Hooks) -------------------- */
  const profileQuery = useQuery({
    queryKey: ["userProfile", numericUserId],
    queryFn: () => getUserProfile(numericUserId),
    enabled: !!numericUserId,
  });

  const postsQuery = useQuery({
    queryKey: ["userPosts", numericUserId],
    queryFn: () => getUserPosts(numericUserId),
    enabled: !!numericUserId,
  });

  const followMutation = useMutation({
    mutationFn: () => toggleFollowUser(numericUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", numericUserId],
      });
    },
  });

  /* -------------------- 데이터 정리 -------------------- */
  const dummyPosts = initialCommunityPosts.filter(
    (p) => p.userId === numericUserId
  );

  const dummyProfile = {
    memberId: numericUserId,
    nickname:
      dummyPosts[0]?.userNickname ??
      profileQuery.data?.nickname ??
      "알 수 없음",
    profileImg: "/images/profile.png",
    followerCount: 0,
    followingCount: 0,
    postCount: dummyPosts.length,
    albumCount: 0,
    isFollowing: false,
  };

  const userProfile =
    !profileQuery.error && profileQuery.data
      ? profileQuery.data
      : dummyProfile;

  const userPosts =
    !postsQuery.error &&
      postsQuery.data &&
      postsQuery.data.length > 0
      ? postsQuery.data
      : dummyPosts;

  const defaultIntro =
    "새로운 것과 낯선 곳에서의 새로운 발견을 즐깁니다.";
  const defaultWebsite = "https://www.figma.com/domentory";

  /* ============================================================== */
  /* -------------------------- RENDER ----------------------------- */
  /* ============================================================== */

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center mt-[60px]">
      {/* 🔥 공통헤더 아래 나오는 "뒤로가기 바" */}
      <div className="w-full max-w-[480px] bg-white h-[55px] border-b border-gray-200 flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 flex items-center justify-center"
        >
          <img
            src="/images/109618.png"
            className="w-[20px] h-[20px]"
            alt="back"
          />
        </button>
        <span className="text-[20px] font-semibold text-gray-900">
          마이페이지
        </span>
      </div>

      {/* 🔥 로딩 처리 (hooks 아래, return 내부에서만 처리) */}
      {profileQuery.isLoading || postsQuery.isLoading ? (
        <div className="w-full h-[200px] flex items-center justify-center">
          로딩 중...
        </div>
      ) : (
        <>
          {/* 상단 배경 */}
          <div className="relative w-full max-w-[480px] h-[180px] overflow-hidden">
            <img
              src="/images/city.png"
              className="absolute w-full h-full object-cover brightness-[0.5]"
            />
          </div>

          {/* 프로필 */}
          <div className="w-full max-w-[480px] px-[15px] mt-[-35px] relative z-10">
            <img
              src={
                !userProfile.profileImg ||
                  userProfile.profileImg === "string"
                  ? "/images/profile.png"
                  : userProfile.profileImg
              }
              className="w-[80px] h-[80px] rounded-full bg-white object-cover shadow-md"
            />

            <div className="flex items-center justify-between w-full mt-[10px] pr-4">
              <h2 className="text-[17px] font-semibold text-gray-800">
                {userProfile.nickname}
              </h2>

              <button
                onClick={() => followMutation.mutate()}
                className={`text-white text-[13px] px-4 py-[5px] rounded-full font-medium ${userProfile.isFollowing
                    ? "bg-gray-400"
                    : "bg-[#FF7070]"
                  }`}
              >
                {userProfile.isFollowing ? "팔로잉" : "팔로우"}
              </button>
            </div>

            <p className="text-[13px] text-gray-700 mt-2">
              {defaultIntro}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <img
                src="/images/link-icon.png"
                className="w-[16px] h-[16px] rotate-45"
              />
              <a
                href={defaultWebsite}
                className="text-[13px] text-blue-600 underline"
              >
                {defaultWebsite}
              </a>
            </div>

            <div className="flex items-center gap-6 mt-3 text-gray-700">
              {/* 팔로잉 */}
              <p
                className="text-[12px] cursor-pointer"
                onClick={() => navigate("/community/followings")}
              >
                <span className="font-semibold">
                  {userProfile.followingCount}
                </span>{" "}
                팔로잉
              </p>

              {/* 팔로워 */}
              <p
                className="text-[12px] cursor-pointer"
                onClick={() => navigate("/community/followers")}
              >
                <span className="font-semibold">
                  {userProfile.followerCount}
                </span>{" "}
                팔로워
              </p>
            </div>

          </div>

          {/* 탭 */}
          <div className="flex justify-center items-center gap-[100px] mt-[30px] mb-[5px]">
            <button
              onClick={() => setActiveTab("posts")}
              className={
                activeTab === "posts"
                  ? "opacity-100"
                  : "opacity-40"
              }
            >
              <img src="/images/list.png" className="w-[25px] h-[25px]" />
            </button>

            <button
              onClick={() => setActiveTab("albums")}
              className={
                activeTab === "albums"
                  ? "opacity-100"
                  : "opacity-40"
              }
            >
              <img src="/images/mark.png" className="w-[25px] h-[25px]" />
            </button>

            <button
              onClick={() => setActiveTab("likes")}
              className={
                activeTab === "likes"
                  ? "opacity-100"
                  : "opacity-40"
              }
            >
              <img src="/images/Heart.png" className="w-[25px] h-[25px]" />
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="grid grid-cols-3 gap-[4px] mt-[20px] px-2 w-full max-w-[480px] mb-[80px]">
            {activeTab === "posts" &&
              (userPosts.length > 0 ? (
                userPosts.map((p: any) => (
                  <div key={p.postId} className="aspect-square">
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

            {activeTab === "albums" && (
              <p className="col-span-3 text-center text-gray-500 mt-10">
                앨범 기능은 준비 중입니다.
              </p>
            )}

            {activeTab === "likes" && (
              <p className="col-span-3 text-center text-gray-500 mt-10">
                좋아요한 게시물 준비 중입니다.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
