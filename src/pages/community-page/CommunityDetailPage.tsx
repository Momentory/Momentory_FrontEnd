import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Bookmark, ArrowUp } from "lucide-react";
import {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "../../api/community";

export default function CommunityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const postId = Number(id);

  // 게시글 더미 데이터
  const post = {
    id: postId,
    userName: "사용자본인",
    userProfile: "/images/profile.png",
    imageUrl: "/images/image51.png",
    title: "이번 주말 다녀온 고양시 스타필드!",
    content:
      "경기도 고양시 덕양구에 위치한 스타필드에 다녀왔어요. 2017년 개장된 쇼핑몰로 조명이 예쁘고 가족 나들이하기 딱 좋았어요. 다양한 맛집과 쇼핑 매장이 있어서 하루 종일 즐기기 좋은 곳이에요!",
    tags: ["#고양시", "#핫플", "#하남"],
    likeCount: 125,
    commentCount: 15,
    saveCount: 120,
    time: "방금 전",
  };

  // 댓글 상태
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  // ✏️ 수정 상태 관리
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  /* ------------------------ 댓글 목록 불러오기 ------------------------ */
  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      try {
        const res = await getComments(postId);
        console.log("💬 댓글 목록 응답:", res.data);

        if (Array.isArray(res.data?.result)) {
          setComments(res.data.result);
        } else {
          console.warn("⚠️ 댓글 목록 응답에 result가 없음:", res.data);
          setComments([]);
        }
      } catch (error) {
        console.error("❌ 댓글 불러오기 실패:", error);
        setComments([]);
      }
    };

    fetchComments();
  }, [postId]);

  /* ------------------------ 댓글 작성 ------------------------ */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log("🟢 댓글 생성 요청:", {
        url: `/api/community/posts/${postId}/comments`,
        body: { content: newComment },
      });

      const res = await createComment(postId, { content: newComment });
      const newOne = res.data?.result;

      if (!newOne) {
        console.warn("⚠️ 서버에서 result가 비어 있음:", res.data);
      } else {
        setComments((prev) => [...prev, newOne]);
      }

      setNewComment("");

      // 최신 댓글 다시 조회
      const getRes = await getComments(postId);
      if (Array.isArray(getRes.data?.result)) {
        setComments(getRes.data.result);
      }
    } catch (error) {
      console.error("❌ 댓글 작성 실패:", error);
    }
  };

  /* ------------------------ 댓글 수정 ------------------------ */
  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      await updateComment(commentId, editContent);
      console.log(`✏️ 댓글 ${commentId} 수정 완료`);

      // 수정 후 목록 갱신
      const res = await getComments(postId);
      setComments(Array.isArray(res.data?.result) ? res.data.result : []);

      // 수정 상태 초기화
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      console.error("❌ 댓글 수정 실패:", error);
    }
  };

  /* ------------------------ 댓글 삭제 ------------------------ */
  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      console.log(`🗑️ 댓글 ${commentId} 삭제 완료`);
    } catch (error) {
      console.error("❌ 댓글 삭제 실패:", error);
    }
  };

  /* ------------------------ 화면 렌더링 ------------------------ */
  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center pb-[100px]">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between w-full max-w-[480px] bg-[#FF7070] text-white px-5 py-3">
        <div className="flex items-center gap-2">
          <img src="/images/menuIcon.png" alt="menu" className="w-[22px] h-[22px]" />
          <img src="/images/notificationIcon.png" alt="alarm" className="w-[22px] h-[22px]" />
        </div>
        <div className="flex items-center gap-1 bg-white text-[#FF7070] px-3 py-[4px] rounded-full">
          <img src="/images/User.png" alt="User" className="w-5 h-5" />
          <span className="text-[13px] font-medium">Username</span>
        </div>
      </header>

      {/* 사용자 정보 */}
      <div className="w-full max-w-[480px] bg-white flex items-center gap-3 px-5 py-3 border-b border-gray-200">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="w-[26px] h-[26px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <img
          src={post.userProfile}
          alt="프로필"
          className="w-[40px] h-[40px] rounded-full border border-gray-300 object-cover"
        />
        <div>
          <p className="text-[15px] font-semibold text-gray-800">{post.userName}</p>
          <p className="text-[12px] text-gray-500">{post.time}</p>
        </div>
      </div>

      {/* 게시글 */}
      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-sm mt-4 px-5 py-5">
        <img
          src={post.imageUrl}
          alt="게시글"
          className="w-full h-[280px] object-cover rounded-2xl mb-4"
        />
        <p className="text-[13px] text-gray-500 mb-2">📍 고양시 · 스타필드</p>
        <h1 className="text-[18px] font-bold text-gray-900 mb-3 leading-snug">
          {post.title}
        </h1>
        <p className="text-[14px] text-gray-700 leading-relaxed mb-4">{post.content}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[#FFFFFF] bg-[#FF7070] text-[12px] font-medium px-3 py-[5px] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 좋아요 / 댓글 / 저장 */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-6 text-[14px] text-gray-600">
            <button className="flex items-center gap-1 active:scale-95 transition">
              <Heart className="w-4 h-4 text-[#FF7070]" />
              <span>{post.likeCount}</span>
            </button>
            <button className="flex items-center gap-1 active:scale-95 transition">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span>{comments.length}</span>
            </button>
            <button className="flex items-center gap-1 active:scale-95 transition">
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span>{post.saveCount}</span>
            </button>
          </div>
          <span className="text-[13px] text-gray-400">저장 {post.saveCount}회</span>
        </div>
      </div>

      {/* 댓글 영역 */}
      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-sm mt-4 px-5 py-5">
        <h2 className="text-[15px] font-semibold text-gray-800 mb-4">모든 댓글</h2>
        <div className="space-y-5">
          {comments.length === 0 && (
            <p className="text-[13px] text-gray-400">아직 댓글이 없습니다.</p>
          )}
          {comments.map((c) => (
            <div key={c.commentId} className="relative border-b border-gray-100 pb-2">
              <p className="text-[14px] font-semibold text-gray-800 mb-[2px]">
                {c.userNickname}
              </p>

              {editingId === c.commentId ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-[13px] flex-1 outline-none"
                  />
                  <button
                    onClick={() => handleUpdateComment(c.commentId)}
                    className="text-[#FF7070] text-[13px] font-medium"
                  >
                    완료
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    className="text-gray-400 text-[13px]"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <p className="text-[13px] text-gray-700">{c.content}</p>
              )}

              {editingId !== c.commentId && (
                <div className="absolute top-0 right-0 flex gap-2 text-[12px] text-gray-400">
                  <button
                    onClick={() => {
                      setEditingId(c.commentId);
                      setEditContent(c.content);
                    }}
                    className="hover:text-[#FF7070]"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(c.commentId)}
                    className="hover:text-red-500"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 댓글 입력창 */}
      <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 flex items-center gap-3 px-4 py-3 z-[200] shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
        <input
          type="text"
          placeholder="댓글을 작성해주세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-[13px] outline-none focus:border-[#FF7070]"
        />
        <button
          onClick={handleAddComment}
          className="bg-[#FF7070] text-white p-2 rounded-full active:scale-95 transition"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
