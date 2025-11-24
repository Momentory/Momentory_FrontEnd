import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFollowings } from "../../api/community";

export default function FollowingsPage() {
  const navigate = useNavigate();

  const { data: followings = [], isLoading } = useQuery({
    queryKey: ["followings", "me"],
    queryFn: getFollowings,
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
      <header className="relative bg-white h-[55px] border-b border-gray-200 flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-5">
          <img src="/images/109618.png" className="w-[20px] h-[20px]" />
        </button>
        <h1 className="text-[18px] font-semibold">내가 팔로우한 사람</h1>
      </header>

      <div className="p-4 space-y-4">
        {followings.length === 0 && (
          <p className="text-center text-gray-500 pt-10">아직 아무도 팔로우하지 않았어요</p>
        )}

        {followings.map((user: any) => (
          <div
            key={user.userId}
            className="flex items-center bg-white p-3 rounded-xl shadow-sm active:scale-95 transition cursor-pointer"
            onClick={() => navigate(`/community/user/${user.userId}`)}
          >
            <img
              src={user.profileImageUrl || "/images/profile.png"}
              className="w-[45px] h-[45px] rounded-full mr-3 object-cover"
            />

            <div className="flex flex-col">
              <span className="text-[15px] font-semibold">{user.nickname}</span>
              <span className="text-[13px] text-gray-500">
                {user.introduction || "소개글이 없습니다"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
