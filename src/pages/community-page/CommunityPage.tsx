import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getCommunityPosts,
  type CommunityPost,
} from "../../api/community";
import CommunityCard from "../../components/community/CommunityCard";

export default function CommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPostAdded = useRef(false);

  /* ---------------- 안전 이미지 처리 ---------------- */
  const safeImage = (url?: string | null) => {
    if (!url || url === "string" || url.trim() === "" || url.startsWith("blob:")) {
      return "/images/default.png";
    }
    return url;
  };

  /* ---------------- 기본 더미 게시글 ---------------- */
  const initialPosts: CommunityPost[] = [
    {
      postId: 99901,
      userId: 101,
      userNickname: "여행하는물고기",
      userProfileImageUrl: "/images/profile.png",
      imageUrl: "/images/image51.png",
      regionName: "고양 시, 스타필드",
      title: "이번 주말 다녀온 고양시 스타필드!",
      content:
        "경기도 고양시 덕양구에 위치한 스타필드에 다녀왔어요.",
      tags: ["#고양시", "#핫플", "#야경"],
      likeCount: 125,
      commentCount: 15,
      time: "12분 전",
    },
    {
      postId: 99902,
      userId: 102,
      userNickname: "여행하는물개",
      userProfileImageUrl: "/images/profile.png",
      imageUrl: "/images/image52.png",
      regionName: "고양 시, 스타필드",
      title: "이번 주말 다녀온 스타필드 & 꽃 축제!",
      content: "화사한 꽃들과 함께 산책",
      tags: ["#고양시", "#핫플", "#꽃길"],
      likeCount: 94,
      commentCount: 8,
      time: "1시간 전",
    },
  ];

  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [tab, setTab] = useState<"latest" | "region">("latest");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  /* ---------------- 카드에서 좋아요/스크랩 변경 반영 ---------------- */
  const handleUpdatePostFromCard = (updated: Partial<CommunityPost>) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === updated.postId ? { ...post, ...updated } : post
      )
    );
  };

  /* ---------------- 전체 게시글 불러오기 ---------------- */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const serverPosts = await getCommunityPosts();

        if (!serverPosts || !Array.isArray(serverPosts)) {
          setPosts(initialPosts);
          return;
        }

        const cleaned = serverPosts.map((p) => ({
          postId: p.postId,
          userId: p.userId,
          userNickname: p.userNickname,
          userProfileImageUrl: safeImage(p.userProfileImageUrl),
          imageUrl: safeImage(p.imageUrl),
          regionName: p.regionName,
          title: p.title,
          content: p.content,
          tags: p.tags ?? [],
          likeCount: p.likeCount,
          commentCount: p.commentCount,
          time: "방금 전",
        }));

        setPosts([...cleaned, ...initialPosts]);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        setPosts(initialPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.state]);

  /* ---------------- 새 글 즉시 반영 ---------------- */
  useEffect(() => {
    const newPost = location.state?.newPost;

    if (newPost && !isPostAdded.current) {
      isPostAdded.current = true;

      const newFormatted: CommunityPost = {
        postId: Date.now(),
        userId: 0,
        userNickname: "사용자",
        userProfileImageUrl: "/images/profile.png",
        imageUrl: safeImage(newPost.image),
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags,
        likeCount: 0,
        commentCount: 0,
        regionId: 1,
      };

      setPosts((prev) => [newFormatted, ...prev]);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }

    return () => {
      isPostAdded.current = false;
    };
  }, [location.state]);


  /* ---------------- 상세 → 목록 좋아요/스크랩 상태 반영 ---------------- */
  useEffect(() => {
    const updated = location.state?.updatedPost;
    if (!updated) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === updated.postId
          ? {
            ...post,
            likeCount: updated.likeCount ?? post.likeCount,
            scrapStatus: updated.scrapStatus ?? post.scrapStatus,
          }
          : post
      )
    );
  }, [location.state?.updatedPost]);


  /* ---------------- 지역 데이터 ---------------- */
  const regionList = [
    { name: "부천시", img: "/images/bucheon.png", regionId: 5 },
    { name: "김포시", img: "/images/gimpo.png", regionId: 14 },
    { name: "용인시", img: "/images/yongin.png", regionId: 4 },
    { name: "이천시", img: "/images/icheon.png", regionId: 18 },
    { name: "평택시", img: "/images/pyeongtaek.png", regionId: 10 },
    { name: "수원시", img: "/images/suwon.png", regionId: 1 },
  ];

  /* ---------------- 렌더링 ---------------- */
  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] relative">

      {/* 상단 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white px-3 py-3">
        <div className="flex items-center gap-3">
          <img src="/images/menuIcon.png" className="w-[22px] h-[22px]" />
          <img src="/images/notificationIcon.png" className="w-[20px] h-[20px]" />
        </div>

        <div className="flex items-center gap-1 bg-white text-[#FF7070] px-3 py-[6px] rounded-full">
          <img src="/images/User.png" className="w-5 h-5" />
          <span className="text-[13px] font-medium">홍홍홍</span>
        </div>
      </header>

      {/* 커뮤니티 제목 */}
      <div className="flex items-center justify-between bg-white px-5 py-6 border-b">
        <h1 className="text-[25px] font-semibold">커뮤니티</h1>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/community/write")}>
            <img src="/images/Edit.png" className="w-[22px]" />
          </button>

          <button onClick={() => navigate("/community/mypage")}>
            <img src="/images/User.png" className="w-[22px]" />
          </button>

          <button onClick={() => navigate("/community/search")}>
            <img src="/images/Search.png" className="w-[22px]" />
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex text-center bg-white border-b">
        <button
          onClick={() => setTab("latest")}
          className={`flex-1 py-5 font-medium ${tab === "latest"
              ? "text-[#FF7070] border-b-2 border-[#FF7070]"
              : "text-gray-700"
            }`}
        >
          최신
        </button>

        <button
          onClick={() => setTab("region")}
          className={`flex-1 py-5 font-medium ${tab === "region"
              ? "text-[#FF7070] border-b-2 border-[#FF7070]"
              : "text-gray-700"
            }`}
        >
          지역별
        </button>
      </div>

      {/* 게시글 / 지역 UI */}
      <div className="p-4 pb-24">
        {tab === "latest" ? (
          loading ? (
            <div className="text-center text-gray-500 py-8">
              게시글 불러오는 중...
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <CommunityCard
                  key={post.postId}
                  post={post}
                  onUpdate={handleUpdatePostFromCard}
                />
              ))}
            </div>
          )
        ) : (
          /* 지역별 */
          <div className="px-2 mt-4">
            <h2 className="text-[20px] font-medium text-gray-800 mb-6 px-2">
              어느 지역의 소식을<br />확인할까요?
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {regionList.map((city) => (
                <button
                  key={city.name}
                  onClick={() =>
                    navigate(`/community/region/${city.regionId}`)
                  }
                  className="relative rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition"
                >
                  <img
                    src={city.img}
                    alt={city.name}
                    className="w-full h-[120px] object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="text-white text-[20px] font-semibold drop-shadow-lg">
                      {city.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 토스트 */}
      {showToast && (
        <div className="fixed bottom-[85px] left-1/2 -translate-x-1/2 bg-[#3D3D3D] text-white px-6 py-3 rounded-full">
          게시물이 업로드 되었어요.
        </div>
      )}
    </div>
  );
}
