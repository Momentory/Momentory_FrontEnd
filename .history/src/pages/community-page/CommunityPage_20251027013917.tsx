import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function CommunityPage() {
  const navigate = useNavigate();

  // 임시 게시글 데이터
  const posts = [
    {
      id: 1,
      user: "여행자 민지",
      title: "남한산성 단풍 너무 예뻐요",
      preview: "이번 주에 다녀왔는데, 경치가 진짜",
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      user: "Traveler J",
      title: "가을 감성 사진 스팟 추천 📸",
      preview: "양평 두물머리 일출 시간대 강추합니다!",
      likes: 18,
      comments: 3,
    },
    {
      id: 3,
      user: "여행덕후",
      title: "오늘은 포천 아트밸리 방문!",
      preview: "맑은 하늘 덕분에 사진이 너무 잘 나왔어요 ☀️",
      likes: 30,
      comments: 8,
    },
  ];

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
          className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-800">
          여행자 커뮤니티
        </h1>
        <div className="w-[38px]" />
      </div>

      {/* 게시글 목록 */}
      <div className="w-[90%] mt-4 space-y-4 mb-20">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/community/${post.id}`)}
            className="border border-gray-200 rounded-[12px] p-4 cursor-pointer shadow-sm hover:shadow-md transition"
          >
            <p className="text-[14px] font-semibold text-gray-700 mb-1">
              {post.user}
            </p>
            <p className="text-[15px] font-bold text-gray-900">{post.title}</p>
            <p className="text-[13px] text-gray-500 mt-1">{post.preview}</p>
            <div className="flex items-center gap-3 mt-2 text-[13px] text-gray-500">
              <div className="flex items-center gap-1">
                <Heart size={14} className="text-[#FF7070]" />
                {post.likes}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                {post.comments}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 하단 + 버튼 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/community/upload")}
        className="fixed bottom-20 right-[calc(50%-220px)] bg-[#FF7070] text-white rounded-full w-[55px] h-[55px] shadow-lg flex items-center justify-center hover:bg-[#ff5a5a] transition"
      >
        <Plus size={28} />
      </motion.button>
    </motion.div>
  );
}
