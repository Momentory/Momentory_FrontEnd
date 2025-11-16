import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostsByRegion, type CommunityPost } from "../../api/community";
import CommunityCard from "../../components/community/CommunityCard";

export default function CommunityRegionPage() {
  const { regionId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- 지역 이름 매핑 ---------------- */
  const REGION_NAMES: Record<number, string> = {
    1: "수원시", 2: "성남시", 3: "고양시", 4: "용인시",
    5: "부천시", 6: "안산시", 7: "안양시", 8: "남양주시",
    9: "화성시", 10: "평택시", 11: "의정부시", 12: "시흥시",
    13: "파주시", 14: "김포시", 15: "광명시", 16: "광주시",
    17: "군포시", 18: "이천시", 19: "양주시", 20: "오산시",
    21: "구리시", 22: "안성시", 23: "포천시", 24: "의왕시",
    25: "하남시", 26: "여주시", 27: "양평군", 28: "동두천시",
    29: "과천시", 30: "가평군", 31: "연천군", 99: "기타"
  };

  const regionName = REGION_NAMES[Number(regionId)] ?? "지역";

  /* ---------------- 지역 게시글 로딩 ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPostsByRegion(Number(regionId));
        const raw = res?.data?.result?.posts || [];

        const normalized = raw.map((p: any) => ({
          ...p,
          imageUrl: p.imageUrl ?? p.image_url ?? "",
          userProfileImageUrl:
            p.userProfileImageUrl ?? p.user_profile_image_url ?? "",
        }));

        setPosts(normalized);
      } catch (err) {
        console.error("지역 게시글 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [regionId]);

  /* ---------------- 렌더링 ---------------- */
  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-[70px]">

      {/* 상단 헤더 */}
      <div className="flex items-center justify-between bg-white px-4 py-4 border-b shadow-sm">

        {/* 뒤로가기 */}
        <button onClick={() => navigate(-1)}>
          <img src="/images/109618.png" className="w-[24px]" />
        </button>

        {/* 제목 중앙 정렬 */}
        <h1 className="text-[22px] font-semibold">
          {regionName} 소식
        </h1>

        {/* 오른쪽 공간 */}
        <div className="w-[24px]"></div>
      </div>

      {/* 게시글 리스트 */}
      <div className="p-4 space-y-5">
        {loading ? (
          <div className="text-center text-gray-500">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            아직 게시글이 없어요!
          </div>
        ) : (
          posts.map((post) => (
            <CommunityCard key={post.postId} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
