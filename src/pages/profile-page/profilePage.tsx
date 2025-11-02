import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Users, Camera } from "lucide-react";

// 게시글 타입 정의
interface UserPost {
  id: number;
  image: string;
  title: string;
}

// 사용자 프로필 타입 정의
interface UserProfile {
  id: string;
  name: string;
  followers: number;
  following: number;
  characterImg: string;
  mapShared: boolean;
  posts: UserPost[];
}

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // 사용자 정보 상태
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // API 연결 전용 더미 데이터
    const fetchUser = async () => {
      try {
        const dummyUser: UserProfile = {
          id: userId || "unknown",
          name: "여행자 민지",
          followers: 125,
          following: 82,
          characterImg: "/images/char1.png",
          mapShared: true,
          posts: [
            { id: 1, image: "/images/sample-travel.jpg", title: "남한산성 단풍 🍂" },
            { id: 2, image: "/images/sample-travel2.jpg", title: "가을 감성 여행" },
          ],
        };
        setUser(dummyUser);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    // 추후 API 연결 (PATCH /users/follow/:userId)
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        사용자 정보를 불러오는 중이에요...
      </div>
    );
  }

  return (
    <motion.div
      className="w-full min-h-screen bg-white flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 헤더 */}
      <div className="sticky top-0 w-full bg-white flex items-center justify-between px-4 py-3 border-b shadow-sm z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-[38px] h-[38px] flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-800">프로필</h1>
        <div className="w-[38px]" />
      </div>

      {/* 프로필 정보 */}
      <div className="w-[90%] mt-6 text-center">
        <img
          src={user.characterImg}
          alt="캐릭터 이미지"
          className="w-[120px] h-[120px] mx-auto rounded-full mb-3 object-cover border-2 border-[#FF7070]"
        />
        <p className="text-[18px] font-bold text-gray-800">{user.name}</p>

        {/* 팔로워 / 팔로잉 */}
        <div className="flex justify-center gap-8 mt-3 text-[14px] text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>팔로워 {user.followers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} className="text-gray-400" />
            <span>팔로잉 {user.following}</span>
          </div>
        </div>

        {/* 팔로우 버튼 */}
        <button
          onClick={handleFollow}
          className={`mt-4 px-6 py-2 text-[15px] rounded-full font-semibold transition ${
            isFollowing
              ? "bg-gray-200 text-gray-700"
              : "bg-[#FF7070] text-white hover:bg-[#ff5a5a]"
          }`}
        >
          {isFollowing ? "팔로잉 중" : "팔로우"}
        </button>
      </div>

      {/* 공개 지도 */}
      <div className="w-[90%] mt-8 border-t pt-5">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={18} className="text-[#FF7070]" />
          <p className="font-semibold text-[15px] text-gray-800">공개 지도</p>
        </div>
        {user.mapShared ? (
          <div className="w-full h-[180px] bg-gray-100 rounded-[10px] flex items-center justify-center text-gray-500">
            <p>지도 미리보기 영역 (추후 API 연동)</p>
          </div>
        ) : (
          <p className="text-gray-500 text-[14px]">이 사용자는 지도를 비공개로 설정했어요.</p>
        )}
      </div>

      {/* 작성한 게시글 */}
      <div className="w-[90%] mt-8 mb-24">
        <div className="flex items-center gap-2 mb-3">
          <Camera size={18} className="text-[#FF7070]" />
          <p className="font-semibold text-[15px] text-gray-800">게시글</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {user.posts.map((p: UserPost) => (
            <div
              key={p.id}
              className="relative rounded-[10px] overflow-hidden cursor-pointer"
              onClick={() => navigate(`/community/${p.id}`)}
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-[140px] object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-[13px] px-2 py-1 truncate">
                {p.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
