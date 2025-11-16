import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Bookmark, Heart } from "lucide-react";
import {
  toggleLike,
  toggleScrap,
  type CommunityPost,
} from "../../api/community";

interface CommunityCardProps {
  post?: CommunityPost;
  onUpdate?: (updatedPost: Partial<CommunityPost>) => void;
}

export default function CommunityCard({ post, onUpdate }: CommunityCardProps) {
  const navigate = useNavigate();

  /* ----------------------- 안전한 초기값 ----------------------- */
  const safePost: CommunityPost = useMemo(() => {
    return {
      postId: post?.postId ?? 0,
      userId: post?.userId ?? 0,
      userNickname: post?.userNickname ?? "알 수 없음",
      userProfileImageUrl:
        !post?.userProfileImageUrl || post.userProfileImageUrl === "string"
          ? "/images/profile.png"
          : post.userProfileImageUrl,
      title: post?.title ?? "",
      content: post?.content ?? "",
      regionName: post?.regionName ?? "",
      createdAt: post?.createdAt ?? "",
      tags: post?.tags ?? [],
      likeCount: post?.likeCount ?? 0,
      commentCount: post?.commentCount ?? 0,
      scrapStatus: post?.scrapStatus ?? false,
      liked: post?.liked ?? false,
      imageUrl:
        !post?.imageUrl || post.imageUrl === "string"
          ? "/images/default.png"
          : post.imageUrl,
      time: post?.time,
    };
  }, [post]);

  /* ----------------------- 내 글 여부 ----------------------- */
  const myUserId = Number(localStorage.getItem("userId"));
  const isMyPost = safePost.userId === myUserId;

  const safeProfile = (url?: string | null) => {
    if (!url || url === "string" || url === "null" || url.trim() === "") {
      return "/images/profile.png";
    }
    return url;
  };

  /* ----------------------- 상대 시간 계산 ----------------------- */
  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return "방금 전";

    const now = new Date();
    const t = new Date(dateString);
    const diff = (now.getTime() - t.getTime()) / 1000;

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
    return `${Math.floor(diff / 604800)}주 전`;
  };

  /* ----------------------- 좋아요 / 스크랩 ----------------------- */
  const [liked, setLiked] = useState<boolean>(safePost.liked ?? false);
  const [scrapped, setScrapped] = useState<boolean>(safePost.scrapStatus ?? false);
  const [likeCount, setLikeCount] = useState<number>(safePost.likeCount ?? 0);

  const handleLike = async (e: any) => {
    e.stopPropagation();
    try {
      await toggleLike(safePost.postId);

      const newLiked = !liked;
      const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;

      setLiked(newLiked);
      setLikeCount(newLikeCount);

      onUpdate?.({
        postId: safePost.postId,
        liked: newLiked,
        likeCount: newLikeCount,
      });
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
    }
  };

  const handleScrap = async (e: any) => {
    e.stopPropagation();
    try {
      await toggleScrap(safePost.postId);

      const newScrapped = !scrapped;
      setScrapped(newScrapped);

      onUpdate?.({
        postId: safePost.postId,
        scrapStatus: newScrapped,
      });
    } catch (err) {
      console.error("스크랩 토글 실패:", err);
    }
  };

  /* ----------------------- 상세 페이지 전달용 ----------------------- */
  const normalizedPost = {
    ...safePost,
    liked,
    scrapStatus: scrapped,
    likeCount,
    time: safePost.time ? safePost.time : getRelativeTime(safePost.createdAt),
  };

  /* ----------------------- 렌더링 ----------------------- */
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">

      {/* 프로필 영역 */}
      <div
        className="w-full bg-white px-4 py-3 border-b border-gray-200 cursor-pointer active:opacity-70"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/community/user/${safePost.userId}`);
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={safeProfile(safePost.userProfileImageUrl)}
            onError={(e) => {
              e.currentTarget.src = "/images/profile.png";
            }}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold">
              {safePost.userNickname}
            </span>

            <span className="text-[9px] text-gray-500">
              {safePost.time ? safePost.time : getRelativeTime(safePost.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* 이미지 클릭 */}
      <div
        className="relative cursor-pointer active:opacity-80"
        onClick={() =>
          navigate(`/community/${safePost.postId}`, {
            state: { post: normalizedPost },
          })
        }
      >
        <img
          src={safePost.imageUrl ?? "/images/default.png"}
          className="w-full h-[280px] object-cover"
        />

      </div>

      {/* 본문 */}
      <div className="p-4">
        {safePost.regionName && (
          <div className="text-[12px] text-black mb-1">
            📌 {safePost.regionName}
          </div>
        )}

        <h2 className="text-[15px] font-semibold text-gray-900 mb-2">
          {safePost.title}
        </h2>

        <p className="text-[11px] text-gray-700 line-clamp-2 mb-4">
          {safePost.content}
        </p>

        {/* 태그 */}
        <div className="flex gap-2 flex-wrap mb-4">
          {safePost.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-[4px] bg-[#FF7070] text-white rounded-full text-[12px]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 좋아요 / 댓글 / 스크랩 */}
        <div className="flex items-center justify-center gap-28 text-gray-500 text-[14px] mt-4">
          <div
            className="flex items-center gap-2 ml-7 cursor-pointer active:scale-95 transition"
            onClick={handleLike}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                liked ? "fill-red-500 text-red-500" : "fill-none text-gray-700"
              }`}
            />
            <span>{likeCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <img src="/images/msg.png" className="w-4 h-4" />
            <span className="font-medium">{safePost.commentCount}</span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition min-w-[60px]"
            onClick={handleScrap}
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${
                scrapped ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-700"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
