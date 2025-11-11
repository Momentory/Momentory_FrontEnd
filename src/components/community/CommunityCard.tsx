import { useNavigate } from "react-router-dom";

interface CommunityCardProps {
  profileImage?: string;
  userName?: string;
  time: string;
  imageUrl: string;
  title: string;
  content: string;
  tags: string[];
  likeCount?: number;
  commentCount?: number;
  userId?: number; 
}

export default function CommunityCard({
  profileImage = "/images/profile.png",
  userName = "여행하는물고기",
  time,
  imageUrl,
  title,
  content,
  tags,
  likeCount = 125,
  commentCount = 15,
  userId = 1, // 기본값
}: CommunityCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* 작성자 정보 */}
      <div
        className="flex items-center gap-2 px-4 pt-4 pb-2 cursor-pointer hover:opacity-80 transition"
        onClick={() => navigate(`/community/user/${userId}`)} 
      >
        <img
          src={profileImage}
          alt="profile"
          className="w-[32px] h-[32px] rounded-full border border-gray-200 object-cover"
        />
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-black-800">{userName}</span>
          <span className="text-[9px] text-gray-700">{time}</span>
        </div>
      </div>

      {/* 게시글 이미지 */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-[260px] object-cover"
      />

      {/* 본문 내용 */}
      <div className="p-4">
        {/* 위치/카테고리 */}
        <p className="text-[12px] text-gray-700 mb-1">고양시, 스타필드</p>

        {/* 제목 */}
        <h2 className="text-[16px] font-semibold text-gray-800 mb-1">{title}</h2>

        {/* 내용 */}
        <p className="text-[14px] text-gray-600 leading-snug mb-3">{content}</p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-5 py-[4px] bg-[#FF7070] text-white text-[13px] rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 구분선 */}
        <div className="w-full h-[1px] bg-gray-200 mb-3" />

        {/* 하단 아이콘 영역 */}
        <div className="flex items-center justify-between text-gray-400 text-[15px]">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1 ml-[29px]">
              <img src="/images/Heart.png" alt="like" className="w-[17px] h-[17px]" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center gap-1 ml-[50px] ">
              <img src="/images/msg.png" alt="comment" className="w-[17px] h-[17px]" />
              <span>{commentCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mr-[24px]">
            <img src="/images/mark.png" alt="save" className="w-[17px] h-[17px]" />
            <span>저장</span>
          </div>
        </div>
      </div>
    </div>
  );
}
