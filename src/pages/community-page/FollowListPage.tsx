import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getFollowers, getFollowings } from "../../api/community";

type FollowType = "followers" | "followings";

interface FollowUser {
  memberId: number;
  nickname: string;
  profileImg?: string;
  isFollowing?: boolean;
}

export default function FollowListPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  
  const followType = (type === "followings" ? "followings" : "followers") as FollowType;
  const isFollowers = followType === "followers";

  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = isFollowers ? "팔로워" : "팔로잉";

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: any[] = [];
        
        if (isFollowers) {
          data = await getFollowers();
        } else {
          data = await getFollowings();
        }

        const normalized = Array.isArray(data) ? data : [];
        setUsers(normalized);
      } catch (err) {
        console.error(`${title} 조회 실패:`, err);
        setError(`${title} 목록을 불러올 수 없습니다.`);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [followType, isFollowers, title]);

  const handleUserClick = (userId: number) => {
    navigate(`/community/user/${userId}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white w-full px-5 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[18px] font-semibold flex-1 text-center">{title}</h1>
        <div className="w-[22px]" />
      </header>

      {/* 카운트 표시 */}
      <div className="bg-white px-5 py-4 border-b border-gray-200">
        <p className="text-[13px] text-gray-600">
          총 <span className="font-semibold text-gray-900">{users.length}</span>명
        </p>
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500 text-[13px]">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-[13px]">{title}이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div
                key={user.memberId}
                className="bg-white px-5 py-4 cursor-pointer active:bg-gray-50 transition"
                onClick={() => handleUserClick(user.memberId)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImg || "/images/profile.png"}
                    alt={user.nickname}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900 truncate">
                      {user.nickname}
                    </p>
                    <p className="text-[12px] text-gray-500">
                      사용자
                    </p>
                  </div>

                  {!isFollowers && user.isFollowing !== undefined && (
                    <span
                      className={`text-[11px] px-3 py-1 rounded-full font-medium ${
                        user.isFollowing
                          ? "bg-gray-200 text-gray-700"
                          : "bg-[#FF7070] text-white"
                      }`}
                    >
                      {user.isFollowing ? "팔로잉" : "팔로우"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
