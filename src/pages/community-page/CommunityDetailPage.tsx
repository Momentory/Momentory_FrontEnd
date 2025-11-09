import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, MessageCircle, Bookmark, ArrowUp } from "lucide-react";

export default function CommunityDetailPage() {
  const navigate = useNavigate();

  const post = {
    id: 1,
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

  const [comments, setComments] = useState([
    { id: 1, author: "산책하는고양이", text: "여기 가족단위로 엄청 좋아요!" },
    { id: 2, author: "산책하는강아지", text: "조명 너무 예쁘다!" },
    { id: 3, author: "산책하는물개", text: "한 번 가보고 싶어요 😊" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), author: "나", text: newComment }]);
    setNewComment("");
  };

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

      {/* 메인 카드 (좌우 여백 포함) */}
      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-sm mt-4 px-5 py-5">
        {/* 이미지 */}
        <img
          src={post.imageUrl}
          alt="게시글"
          className="w-full h-[280px] object-cover rounded-2xl mb-4"
        />

        {/* 본문 내용 */}
        <p className="text-[13px] text-gray-500 mb-2">📍 고양시 · 스타필드</p>
        <h1 className="text-[18px] font-bold text-gray-900 mb-3 leading-snug">
          {post.title}
        </h1>
        <p className="text-[14px] text-gray-700 leading-relaxed mb-4">{post.content}</p>

        {/* 태그 */}
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
              <span>{post.commentCount}</span>
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
          {comments.map((c) => (
            <div key={c.id}>
              <p className="text-[14px] font-semibold text-gray-800 mb-[2px]">
                {c.author}
              </p>
              <p className="text-[13px] text-gray-700">{c.text}</p>
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
