import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CommunityCard from "../../components/community/CommunityCard";
import { getCommunityPosts } from "../../api/community";

export default function CommunityPage() {
  const [tab, setTab] = useState<"latest" | "region">("latest");
  const navigate = useNavigate();
  const location = useLocation();
  const isPostAdded = useRef(false);

  /*  기본 게시글 ( */
  const initialPosts = [
    {
      id: 1,
      imageUrl: "/images/image51.png",
      title: "이번 주말 다녀온 고양시 스타필드!",
      content:
        "경기도 고양시 덕양구에 위치한 스타필드에 다녀왔어요. 조명이 너무 예뻐서 가족들과 즐거운 시간을 보냈어요.",
      tags: ["#고양시", "#핫플", "#야경"],
      time: "12분 전",
      likeCount: 125,
      commentCount: 15,
    },
    {
      id: 2,
      imageUrl: "/images/everland.png",
      title: "용인 에버랜드 봄꽃 축제 🌸",
      content:
        "봄이라 꽃이 너무 예쁘게 피었어요. 튤립이 가득한 정원에서 인생샷 남기기 딱 좋았어요!",
      tags: ["#용인시", "#봄꽃", "#에버랜드"],
      time: "1시간 전",
      likeCount: 82,
      commentCount: 7,
    },
  ];

  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [/*error*/, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  /* ----------------------------- 전체 게시글 불러오기 ----------------------------- */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getCommunityPosts();
        console.log("전체 게시글:", data);

        // 서버에서 유효한 데이터가 있으면 추가
        if (Array.isArray(data) && data.length > 0) {
          setPosts([...data, ...initialPosts]);
        } else if (data?.result?.posts?.length > 0) {
          setPosts([...data.result.posts, ...initialPosts]);
        } else {
          console.log("서버 게시글 없음 → 기본 게시글 유지");
        }
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        // 에러 나도 기본 게시글은 유지
        setPosts(initialPosts);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.state]);

  /* ----------------------------- 새 게시글 반영 ----------------------------- */
  useEffect(() => {
    const newPost = location.state?.newPost;
    if (newPost && !isPostAdded.current) {
      isPostAdded.current = true;

      const newEntry = {
        id: Date.now(),
        imageUrl: newPost.image,
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags || [],
        time: "방금 전",
        likeCount: 0,
        commentCount: 0,
      };

      setPosts((prev) => [newEntry, ...prev]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, [location.state]);

  /* ----------------------------- 렌더링 ----------------------------- */
  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] relative">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white px-5 py-3">
        <div className="flex items-center gap-3">
          <button>
            <img src="/images/menuIcon.png" alt="menu" className="w-[22px] h-[22px]" />
          </button>
          <button>
            <img src="/images/notificationIcon.png" alt="notification" className="w-[20px] h-[20px]" />
          </button>
        </div>
        <div className="flex items-center gap-1 bg-white text-[#FF7070] px-3 py-[4px] rounded-full">
          <img src="/images/User.png" alt="User" className="w-5 h-5" />
          <span className="text-[13px] font-medium">Username</span>
        </div>
      </header>

      {/* 커뮤니티 제목 */}
      <div className="flex items-center justify-between bg-white px-5 py-6 border-b border-gray-200">
        <h1 className="text-[25px] font-semibold text-gray-800">커뮤니티</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/community/write")} className="hover:opacity-80 transition">
            <img src="/images/Edit.png" alt="글쓰기" className="w-[22px] h-[22px]" />
          </button>
          <button onClick={() => navigate("/community/mypage")} className="hover:opacity-80 transition">
            <img src="/images/User.png" alt="내활동" className="w-[22px] h-[22px]" />
          </button>
          <button onClick={() => navigate("/community/search")} className="hover:opacity-80 transition">
            <img src="/images/Search.png" alt="검색" className="w-[22px] h-[22px]" />
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex text-center border-b border-gray-200 bg-white">
        <button
          onClick={() => setTab("latest")}
          className={`flex-1 py-5 font-medium ${
            tab === "latest"
              ? "text-[#FF7070] border-b-2 border-[#FF7070]"
              : "text-gray-700"
          }`}
        >
          최신
        </button>
        <button
          onClick={() => setTab("region")}
          className={`flex-1 py-5 font-medium ${
            tab === "region"
              ? "text-[#FF7070] border-b-2 border-[#FF7070]"
              : "text-gray-700"
          }`}
        >
          지역별
        </button>
      </div>

      {/* 본문 */}
      <div className="p-4 pb-24">
        {tab === "latest" ? (
          loading ? (
            <div className="text-center text-gray-500 py-8">게시글 불러오는 중...</div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <CommunityCard
                  key={post.id}
                  imageUrl={post.imageUrl}
                  title={post.title}
                  content={post.content}
                  tags={post.tags}
                  time={post.time}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                />
              ))}
            </div>
          )
        ) : (
          <div className="px-2 mt-4">
            <h2 className="text-[20px] font-medium text-gray-800 mb-6 px-2">
              어느 지역의 소식을<br />확인할까요?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "부천시", img: "/images/bucheon.png" },
                { name: "김포시", img: "/images/gimpo.png" },
                { name: "용인시", img: "/images/yongin.png" },
                { name: "이천시", img: "/images/icheon.png" },
                { name: "평택시", img: "/images/pyeongtaek.png" },
                { name: "수원시", img: "/images/suwon.png" },
              ].map((city) => (
                <button
                  key={city.name}
                  className="relative rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition"
                >
                  <img src={city.img} alt={city.name} className="w-full h-[120px] object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-[20px] font-semibold drop-shadow-md">
                    {city.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 토스트 */}
      {showToast && (
        <div className="fixed bottom-[85px] w-[345px] left-1/2 -translate-x-1/2 bg-[#3D3D3D] flex items-center justify-center text-white text-[15px] px-6 py-3 rounded-full shadow-lg animate-fadeIn z-50">
          게시물이 업로드 되었어요.
        </div>
      )}
    </div>
  );
}
