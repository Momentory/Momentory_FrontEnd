import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "../../api/community";

interface Comment {
  commentId: number;
  userId: number;
  userNickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // 수정 관련 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  /* ------------------- 댓글 목록 불러오기 ------------------- */
  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      try {
        const res = await getComments(postId);
        console.log(" 댓글 목록 응답:", res.data);
        setComments(Array.isArray(res.data.result) ? res.data.result : []);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
        setComments([]);
      }
    };

    fetchComments();
  }, [postId]);

  /* ------------------- 댓글 작성 ------------------- */
  // CommentSection.tsx

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await createComment(postId, newComment);   
      setNewComment("");

      const { data } = await getComments(postId);
      setComments(Array.isArray(data.result) ? data.result : []);
    } catch (error) {
      console.error(" 댓글 작성 실패:", error);
    }
  };


  /* ------------------- 댓글 삭제 ------------------- */
  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      console.log(` 댓글 ${commentId} 삭제 완료`);
    } catch (error) {
      console.error(" 댓글 삭제 실패:", error);
    }
  };

  /* ------------------- 댓글 수정 ------------------- */
  const handleUpdate = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent);
      console.log(` 댓글 ${commentId} 수정 완료`);

      // 수정 후 목록 새로고침
      const res = await getComments(postId);
      setComments(Array.isArray(res.data?.result) ? res.data.result : []);

      // 수정 상태 초기화
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      console.error(" 댓글 수정 실패:", error);
    }
  };

  /* ------------------- JSX 렌더링 ------------------- */
  return (
    <div className="mt-4">
      {/* 댓글 목록 */}
      <h2 className="text-[15px] font-semibold text-gray-800 mb-4">
        모든 댓글
      </h2>
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-[13px] text-gray-400">아직 댓글이 없습니다.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.commentId}
              className="relative border-b border-gray-100 pb-2"
            >
              <p className="text-[14px] font-semibold text-gray-800 mb-[2px]">
                {c.userNickname}
              </p>

              {/* 수정 중이면 input, 아니면 텍스트 */}
              {editingId === c.commentId ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-[13px] flex-1 outline-none"
                  />
                  <button
                    onClick={() => handleUpdate(c.commentId)}
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

              {/* 수정 / 삭제 버튼 */}
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
                    onClick={() => handleDelete(c.commentId)}
                    className="hover:text-red-500"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 댓글 입력 */}
      <div className="mt-5 flex gap-2 items-center border-t border-gray-200 pt-3">
        <input
          type="text"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-3 py-2 text-[13px] outline-none focus:border-[#FF7070]"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#FF7070] text-white p-2 rounded-full active:scale-95 transition"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
