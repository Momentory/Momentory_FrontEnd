import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MessageCircle, Bookmark } from "lucide-react";

export default function CommunityDetailPage() {
  const navigate = useNavigate();

  // 임시 상태
  const [liked, setLiked] = useState(false);
  const [scrapped, setScrapped] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: "여행자 민지", text: "와 분위기 너무 좋아요 " },
    { id: 2, user: "Traveler J", text: "사진 구도 대박이에요!" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => setLiked((prev) => !prev);
  const handleScrap = () => setScrapped((prev) => !prev);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newCmt = { id: Date.now(), user: "나", text: newComment };
    setComments([...comments, newCmt]);
    setNewComment("");
  };

  //  프로필 페이지로 이동
  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-white flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 헤더 */}
      <div className="sticky top-0 w-full bg-white flex items-center justify-between px-4 py-3 border-b shadow-sm z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-[38px] h-[38px] flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-800">여행자 커뮤니티</h1>
        <div className="w-[38px]" />
      </div>

      {/* 게시글 본문 */}
      <div className="w-[90%] mt-4 mb-24">
        {/* 작성자 정보 */}
        <div className="flex items-center justify-between mb-3">
          {/* 작성자 이름 클릭 시 프로필로 이동 */}
          <button
            onClick={() => handleProfileClick("user-minji")} // userId를 API 데이터에 맞게 변경 가능
            className="text-[15px] font-semibold text-gray-800 hover:text-[#FF7070] transition"
          >
            여행자 민지
          </button>
          <button className="text-[13px] text-[#FF7070] font-medium">
            팔로우
          </button>
        </div>

        {/* 게시글 이미지 */}
        <img
          src="/images/sample-travel.jpg"
          alt="게시글 이미지"
          className="w-full h-[320px] object-cover rounded-[14px] mb-3"
        />

        {/* 좋아요/댓글/스크랩 아이콘 */}
        <div className="flex items-center gap-6 mb-3">
          <button onClick={handleLike}>
            <Heart
              size={24}
              className={liked ? "fill-[#FF7070] text-[#FF7070]" : "text-gray-600"}
            />
          </button>
          <MessageCircle size={24} className="text-gray-600" />
          <button onClick={handleScrap}>
            <Bookmark
              size={22}
              className={scrapped ? "fill-[#FF7070] text-[#FF7070]" : "text-gray-600"}
            />
          </button>
        </div>

        {/* 제목 및 내용 */}
        <p className="font-semibold text-[15px] text-gray-900 mb-1">
          남한산성 단풍 너무 예뻐요
        </p>
        <p className="text-[14px] text-gray-700 leading-relaxed">
          주말에 남한산성 다녀왔는데 진짜 색감이 예술이에요.
          단풍이랑 하늘이 너무 예뻐서 사진 엄청 찍었어요!
        </p>
      </div>

      {/* 댓글 영역 */}
      <div className="w-[90%] mb-28">
        <p className="font-semibold text-[15px] mb-3">
          댓글 {comments.length}개
        </p>
        {comments.map((c) => (
          <div key={c.id} className="border-b pb-2 mb-2">
            <p className="text-[14px] font-semibold text-gray-800">{c.user}</p>
            <p className="text-[14px] text-gray-600">{c.text}</p>
          </div>
        ))}
      </div>

      {/* 댓글 입력창 */}
      <div className="fixed bottom-20 w-full max-w-[480px] bg-white border-t flex items-center px-3 py-2">
        <input
          type="text"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 text-[14px] border rounded-[10px] px-3 py-2 outline-none"
        />
        <button
          onClick={handleAddComment}
          className="ml-2 px-4 py-2 text-[14px] bg-[#FF7070] text-white rounded-[10px] hover:bg-[#ff5a5a] transition"
        >
          등록
        </button>
      </div>
    </motion.div>
  );
}
