import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFollowingsByUserId } from "../../api/community";

export default function FollowingsPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const numericUserId = Number(userId);

  const { data: followings = [], isLoading } = useQuery({
    queryKey: ["followings", numericUserId],
    queryFn: () => getFollowingsByUserId(numericUserId),
    enabled: !!numericUserId,
  });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        로딩 중...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] mt-[60px]">

      {/* 상단 헤더 */}
      <header className="relative bg-white h-[55px] border-b border-gray-200 flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-5">
          <img src="/images/109618.png" className="w-[20px] h-[20px]" />
        </button>
        <h1 className="text-[18px] font-semibold">팔로잉</h1>
      </header>

      {/* 목록 */}
      <div className="p-4">
        {followings.length === 0 ? (
          <p className="text-center mt-20 text-gray-500">
            팔로잉한 사용자가 없습니다.
          </p>
        ) : (
          followings.map((user: any) => (
            <div
              key={user.userId}
              className="flex items-center mb-4 cursor-pointer"
              onClick={() => navigate(`/community/user/${user.userId}`)}
            >
              <img
                src={user.profileImg || "/images/profile.png"}
                className="w-12 h-12 rounded-full object-cover shadow"
              />
              <p className="ml-3 text-[15px] font-semibold">{user.nickname}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
