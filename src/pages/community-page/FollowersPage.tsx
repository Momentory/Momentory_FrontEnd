import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFollowers } from "../../api/community";

export default function FollowersPage() {
  const navigate = useNavigate();

  const { data: followers = [], isLoading } = useQuery({
    queryKey: ["followers", "me"],
    queryFn: getFollowers,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] mt-[60px]">
      {/* 상단 헤더 */}
      <header className="relative bg-white h-[55px] border-b border-gray-200 flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-5">
          <img src="/images/109618.png" className="w-[20px] h-[20px]" />
        </button>
        <h1 className="text-[18px] font-semibold">내 팔로워</h1>
      </header>

      {/* 리스트 */}
      <div className="p-4 space-y-4">
        {followers.length === 0 && (
          <p className="text-center text-gray-500 pt-10">아직 팔로워가 없어요</p>
        )}

        {followers.map((follower: any) => (
          <div
            className="flex items-center bg-white p-3 rounded-xl shadow-sm active:scale-95 transition cursor-pointer"
            key={follower.userId}
            onClick={() => navigate(`/community/user/${follower.userId}`)}
          >
            <img
              src={follower.profileImageUrl || "/images/profile.png"}
              className="w-[45px] h-[45px] rounded-full mr-3 object-cover"
            />

            <div className="flex flex-col">
              <span className="text-[15px] font-semibold">{follower.nickname}</span>
              <span className="text-[13px] text-gray-500">
                {follower.introduction || "소개글이 없습니다"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
