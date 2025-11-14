import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CommunityMyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "scrap" | "like">("list");

  const [backgroundImage, setBackgroundImage] = useState("/images/city.png");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  const handleBackgroundClick = () => {
    fileInputRef.current?.click();
  };

  /* -------------------------------- 더미 데이터 (내 글 / 스크랩 / 좋아요)------------------------------- */
  const myPosts = [
    "/images/pic1.png",
    "/images/pic2.png",
    "/images/pic3.png",
    "/images/pic4.png",
    "/images/pic5.png",
    "/images/image51.png",
  ];

  const scrapPosts = [
    "/images/image51.png",
    "/images/image52.png",
    "/images/pic6.png",
  ];

  const likedPosts = [
    "/images/everland.jpg",
    "/images/pic2.png",
    "/images/pic3.png",
  ];

  const currentPosts =
    activeTab === "list"
      ? myPosts
      : activeTab === "scrap"
      ? scrapPosts
      : likedPosts;

  /* -------------------------------- 상세 페이지 이동 함수------------------------------------- */
  const goToDetail = (src: string, idx: number) => {
    navigate(`/community/${idx + 1}`, {
      state: {
        post: {
          postId: idx + 1,
          userId: 0,
          userNickname: "여행하는물개",
          userProfileImageUrl: "/images/profile.png",
          regionName: "고양시",
          imageUrl: src,
          title: "이번 주말 다녀온 고양시 스타필드!",
          content:
            "경기도 고양시 덕양구에 위치한 스타필드에 다녀왔어요. 조명이 너무 예뻐서 가족들과 좋은 시간을 보냈어요.",
          tags: ["#고양시", "#핫플", "#야경"],
          likeCount: 125,
          commentCount: 15,
          createdAt: new Date().toISOString(),
        },
      },
    });
  };

  /* ------------------------------렌더링 ------------------------------------------------------- */
  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center">

      {/* 상단 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white w-full max-w-[480px] px-5 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
      </header>

      {/* 타이틀 */}
      <div className="relative bg-white border-b border-gray-200 h-[55px] flex items-center justify-center w-full max-w-[480px] mt-5">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] w-[26px] h-[26px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[25px] font-semibold text-gray-800">마이페이지</h1>
      </div>

      {/* 배경 이미지 */}
      <div
        className="relative w-full max-w-[480px] h-[180px] overflow-hidden cursor-pointer group"
        onClick={handleBackgroundClick}
      >
        <img
          src={backgroundImage}
          alt="배경"
          className="absolute w-full h-full object-cover brightness-[0.45] transition-all duration-300 group-hover:brightness-[0.35]"
        />

        {/* 변경 안내 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-white text-[15px] font-medium">
            배경화면 변경하기
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBackgroundChange}
        />
      </div>

      {/* 프로필 */}
      <div className="w-full max-w-[480px] px-[15px] mt-[-35px] relative z-10">
        <img
          src="/images/profile.png"
          alt="프로필"
          className="w-[80px] h-[80px] rounded-full object-cover shadow-md border-white bg-white"
        />

        <div className="mt-[8px]">
          <h2 className="text-[17px] font-semibold text-gray-800">
            여행하는물개
          </h2>
          <p className="text-[13px] text-gray-500 w-[282px] leading-snug">
            새로운 것과 낯선 곳에서의 새로운 발견을 즐깁니다.
          </p>
        </div>

        {/* 아이콘 탭 */}
        <div className="flex justify-center items-center gap-[120px] mt-[40px] mb-[2px]">
          <button
            onClick={() => setActiveTab("list")}
            className={`${activeTab === "list" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/images/list.png" className="w-[25px] h-[25px]" />
          </button>

          <button
            onClick={() => setActiveTab("scrap")}
            className={`${activeTab === "scrap" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/images/mark.png" className="w-[25px] h-[25px]" />
          </button>

          <button
            onClick={() => setActiveTab("like")}
            className={`${activeTab === "like" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/images/Heart.png" className="w-[25px] h-[25px]" />
          </button>
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="grid grid-cols-3 gap-[4px] mt-[25px] px-2 w-full max-w-[480px]">
        {currentPosts.map((src, idx) => (
          <div
            key={idx}
            className="aspect-square cursor-pointer active:scale-[0.98] transition"
            onClick={() => goToDetail(src, idx)}
          >
            <img
              src={src}
              alt={`게시물 ${idx + 1}`}
              className="w-full h-full object-cover rounded-[6px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
