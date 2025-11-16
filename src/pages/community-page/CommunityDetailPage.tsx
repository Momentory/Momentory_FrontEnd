import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import {
  getCommunityPostDetail,
  getComments,
  createComment,
  deleteComment,
  updateComment,
  toggleLike,
  toggleScrap,
  deletePost,
} from "../../api/community";

/* 상대 시간 계산 */
function getRelativeTime(dateString: string) {
  if (!dateString) return "방금 전";

  const now = new Date();
  const past = new Date(dateString);
  const diff = (now.getTime() - past.getTime()) / 1000;

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}주 전`;
  return `${Math.floor(diff / 2592000)}달 전`;
}

export default function CommunityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const postId = Number(id);

  const initialPost = location.state?.post || null;

  const [post, setPost] = useState<any>(initialPost);
  const [showMenu, setShowMenu] = useState(false);

  /* 좋아요/스크랩 상태 */
  const [liked, setLiked] = useState<boolean>(post?.liked ?? false);
  const [scrapped, setScrapped] = useState<boolean>(post?.scrapStatus ?? false);
  const [likeCount, setLikeCount] = useState<number>(post?.likeCount ?? 0);

  /* 댓글 */
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const safe = (url?: string | null) =>
    !url || url === "string" || url.startsWith("blob:")
      ? "/images/default.png"
      : url;

  /* 게시글 상세 불러오기 */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!initialPost) {
          const data = await getCommunityPostDetail(postId);

          setPost({
            ...data,
            imageUrl: safe(data.imageUrl),
            userProfileImageUrl: safe(data.userProfileImageUrl),
          });

          setLiked(data.liked ?? false);
          setScrapped(data.scrapStatus ?? false);
          setLikeCount(data.likeCount ?? 0);
        } else {
          setPost({
            ...initialPost,
            imageUrl: safe(initialPost.imageUrl),
            userProfileImageUrl: safe(initialPost.userProfileImageUrl),
          });

          setLiked(initialPost.liked ?? false);
          setScrapped(initialPost.scrapStatus ?? false);
          setLikeCount(initialPost.likeCount ?? 0);
        }
      } catch (err) {
        console.error("상세 불러오기 오류:", err);
      }
    };

    fetchDetail();
  }, [postId]);

  /* 댓글 불러오기 */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getComments(postId);

        let list: any[] = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.result)) list = res.result;

        setComments(list);
      } catch (err) {
        console.error("댓글 불러오기 실패:", err);
      }
    };

    load();
  }, [postId]);

  if (!post) return <div className="h-screen bg-white"></div>;

  /* 댓글 작성 */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const created = await createComment(postId, newComment);

    if (created) {
      setComments((prev) => [...prev, created]);
      setPost((prev: any) => ({
        ...prev,
        commentCount: prev.commentCount + 1,
      }));
    }

    setNewComment("");
  };

  /* 댓글 삭제 */
  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId);

    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    setPost((prev: any) => ({
      ...prev,
      commentCount: prev.commentCount - 1,
    }));
  };

  /* 댓글 수정 */
  const handleEditStart = (commentId: number, content: string) => {
    setEditCommentId(commentId);
    setEditContent(content);
  };

  const handleEditSave = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent);

      setComments((prev) =>
        prev.map((c) =>
          c.commentId === commentId ? { ...c, content: editContent } : c
        )
      );

      setEditCommentId(null);
      setEditContent("");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };

  /* 좋아요 토글 */
  const handleToggleLike = async () => {
    try {
      await toggleLike(postId);

      setLiked((prev) => !prev);

      setLikeCount((prev) => {
        const newCount = liked ? prev - 1 : prev + 1;

        setPost((p: any) => ({
          ...p,
          likeCount: newCount,
          liked: !liked,
        }));

        return newCount;
      });
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
    }
  };

  /* 스크랩 토글 */
  const handleToggleScrap = async () => {
    try {
      await toggleScrap(postId);

      setScrapped((prev) => !prev);

      setPost((p: any) => ({
        ...p,
        scrapStatus: !scrapped,
      }));
    } catch (err) {
      console.error("스크랩 토글 실패:", err);
    }
  };

  /* 게시글 삭제 */
  const handleDeletePost = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deletePost(postId);
      alert("게시글 삭제됨");
      navigate("/community");
    } catch (err) {
      console.error(" 삭제 실패:", err);
      alert("삭제 실패");
    }
  };

  /* 게시글 수정 */
  const handleEditPost = () => {
    navigate("/community/write", {
      state: { post, isEdit: true },
    });
  };

  /* 뒤로가기: 목록으로 좋아요/스크랩 반영 */
  const goBackWithSync = () => {
    navigate("/community", {
      state: {
        updatedPost: {
          postId,
          liked,
          likeCount,
          scrapStatus: scrapped,
        },
      },
    });
  };

  return (
    <div className="w-full max-w-[480px] mx-auto min-h-screen bg-[#F9FAFB] pb-[200px] pt-[64px]">

      {/* 헤더 */}
      <div className="flex items-center justify-between bg-white px-4 py-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={goBackWithSync}>
            <img src="/images/109618.png" className="w-[24px]" />
          </button>

          <img
            src="/images/profile.png"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="font-semibold">{post.userNickname}</span>
            <span className="text-[10px] text-gray-700">
              {getRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}>
            <img src="/images/more.png" className="w-6" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-[160px] bg-white rounded-xl shadow-xl border p-2 z-50">

              <button
                className="flex items-center gap-2 w-full px-2 py-2 text-left hover:bg-gray-100 rounded-lg"
                onClick={handleEditPost}
              >
                <img src="/images/edit-icon.png" className="w-4 h-4" />
                <span>게시글 수정</span>
              </button>

              <button
                className="flex items-center gap-2 w-full px-2 py-2 text-left text-red-500 hover:bg-gray-100 rounded-lg"
                onClick={handleDeletePost}
              >
                <img src="/images/delete.png" className="w-4 h-4" />
                <span>게시글 삭제</span>
              </button>

            </div>
          )}
        </div>
      </div>

      {/* 이미지 */}
      <img
        src={post.imageUrl}
        className="h-[280px] object-cover my-6 mx-6 shadow-sm rounded-xl"
        style={{ width: "calc(100% - 48px)" }}
      />

      {/* 본문 */}
      <div className="bg-white px-3 py-1 mt-2">

        <span className="text-[12px]">📌 {post.regionName}</span>

        <h2 className="text-[15px] text-black-800 font-semibold mt-1">
          {post.title}
        </h2>

        <p className="text-[11px] text-gray-700 whitespace-pre-line mt-2">
          {post.content}
        </p>

        {/* 태그 */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2 mb-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-[4px] bg-[#FF7070] text-white rounded-full text-[12px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요 / 댓글 / 스크랩 */}
        <div className="flex items-center gap-32 text-[14px] mt-6 ">

          {/* 좋아요 */}
          <div
            className="flex items-center ml-6 gap-1 cursor-pointer active:scale-95 transition"
            onClick={handleToggleLike}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                liked
                  ? "fill-red-500 text-red-500"
                  : "fill-none text-gray-700"
              }`}
            />
            {likeCount}
          </div>

          {/* 댓글 */}
          <div className="flex items-center gap-1">
            <img src="/images/msg.png" className="w-4" />
            {post.commentCount ?? 0}
          </div>

          {/* 스크랩 */}
          <div
            className="flex items-center mr-2 gap-1 cursor-pointer active:scale-95 transition"
            onClick={handleToggleScrap}
          >
            <Bookmark
              className={`w-5 h-5 transition-colors ${
                scrapped
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-gray-700"
              }`}
            />
          </div>
        </div>
      </div>

      {/* 댓글 */}
      <div className="px-4 mt-6">

        <div className="flex justify-between mb-3">
          <h3 className="text-[12px] text-gray-400 font-semibold">
            모든 댓글
          </h3>

          <span className="text-[12px] text-gray-400">
            저장 {post.viewCount ?? 0}회
          </span>
        </div>

        {comments.map((c) => (
          <div key={c.commentId} className="bg-white p-4 rounded-xl shadow mb-3">

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src="/images/profile.png"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-[11px] font-medium">
                  {c.userNickname}
                </span>
                <span className="text-[8px] text-gray-400">
                  {getRelativeTime(c.createdAt)}
                </span>
              </div>

              <div className="flex flex-col items-center text-gray-400">
                <img src="/images/Heart.png" className="w-5" />
                <span className="text-[11px]">{c.likeCount ?? 0}</span>
              </div>
            </div>

            {/* 수정 모드 */}
            {editCommentId === c.commentId ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-[14px] mt-2"
                />

                <div className="flex gap-4 mt-2 text-[12px]">
                  <button
                    className="text-[#FF7070] font-medium"
                    onClick={() => handleEditSave(c.commentId)}
                  >
                    저장
                  </button>

                  <button
                    className="text-gray-500"
                    onClick={() => setEditCommentId(null)}
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mt-2">{c.content}</p>

                <div className="flex gap-4 mt-2 text-[12px] text-gray-500">
                  <button>답글 달기</button>
                  <button onClick={() => handleEditStart(c.commentId, c.content)}>
                    수정
                  </button>
                  <button onClick={() => handleDeleteComment(c.commentId)}>
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 댓글 입력 */}
      <div className="fixed bottom-[70px] left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 py-3 bg-white flex items-center gap-3 border-t shadow-lg">

        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성하세요…"
          className="flex-1 border rounded-full px-4 py-2 text-[10px]"
        />

        <button
          onClick={handleAddComment}
          className="w-10 h-10 bg-[#FF7070] rounded-full flex items-center justify-center text-white active:scale-95"
        >
          <img src="/images/BackIcon.png" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
