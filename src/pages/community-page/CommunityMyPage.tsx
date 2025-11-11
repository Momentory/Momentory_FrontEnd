import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CommunityMyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "scrap" | "like">("list");

  //  배경 이미지 상태 + 파일 선택 input
  const [backgroundImage, setBackgroundImage] = useState("/images/city.png");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 배경 이미지 변경 핸들러
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl); // 미리보기 적용
    }
  };

  // 배경 클릭 시 파일 업로드 창 열기
  const handleBackgroundClick = () => {
    fileInputRef.current?.click();
  };

  const myPosts = [
    "/images/pic1.png",
    "/images/pic2.png",
    "/images/pic3.png",
    "/images/pic4.png",
    "/images/pic5.png",
    "/images/image51.png"
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

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white w-full max-w-[480px] px-5 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
      </header>

      {/* 마이페이지 타이틀 */}
      <div className="relative bg-white border-b border-gray-200 h-[55px] flex items-center justify-center w-full max-w-[480px] mt-5">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] w-[26px] h-[26px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[25px] font-semibold text-gray-800">마이페이지</h1>
      </div>

      {/* 배경 (클릭으로 수정 가능) */}
      <div
        className="relative w-full max-w-[480px] h-[180px] overflow-hidden cursor-pointer group"
        onClick={handleBackgroundClick}
      >
        <img
          src={backgroundImage}
          alt="배경"
          className="absolute w-full h-full object-cover brightness-[0.45] transition-all duration-300 group-hover:brightness-[0.35]"
        />

        {/* 배경 변경 안내 문구 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-white text-[15px] font-medium">
            배경화면 변경하기
          </span>
        </div>

        {/* 숨겨진 파일 입력창 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBackgroundChange}
        />
      </div>

      {/* 프로필 + 텍스트 + 아이콘 */}
      <div className="w-full max-w-[480px] px-[15px] mt-[-35px] relative z-10">
        <img
          src="/images/profile.png"
          alt="프로필"
          className="w-[80px] h-[80px] rounded-full object-cover shadow-md border-white bg-white"
        />

        {/* 닉네임 + 소개문 */}
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
            className={`transition ${activeTab === "list" ? "opacity-100" : "opacity-40"
              }`}
          >
            <img src="/images/list.png" alt="내 글" className="w-[25px] h-[25px]" />
          </button>

          <button
            onClick={() => setActiveTab("scrap")}
            className={`transition ${activeTab === "scrap" ? "opacity-100" : "opacity-40"
              }`}
          >
            <img src="/images/mark.png" alt="스크랩" className="w-[25px] h-[25px]" />
          </button>

          <button
            onClick={() => setActiveTab("like")}
            className={`transition ${activeTab === "like" ? "opacity-100" : "opacity-40"
              }`}
          >
            <img src="/images/Heart.png" alt="좋아요" className="w-[25px] h-[25px]" />
          </button>
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="grid grid-cols-3 gap-[4px] mt-[25px] px-2 w-full max-w-[480px]">
        {currentPosts.map((src, idx) => (
          <div
            key={idx}
            className="aspect-square cursor-pointer active:scale-[0.98] transition"
            onClick={() => {
              // 특정 게시글이 image51.png인 경우 디테일 페이지 이동
              if (src === "/images/image51.png") {
                navigate(`/community/detail/${idx + 1}`, {
                  state: {
                    post: {
                      id: idx + 1,
                      imageUrl: src,
                      title: "이번 주말 다녀온 고양시 스타필드!",
                      content:
                        "경기도 고양시 덕양구에 위치한 스타필드에 다녀왔어요. 조명이 너무 예뻐서 가족들과 좋은 시간을 보냈어요.",
                      tags: ["#고양시", "#핫플", "#야경"],
                      createdAt: new Date().toISOString(),
                      likeCount: 125,
                      commentCount: 15,
                    },
                  },
                });
              } else {
                // 다른 이미지는 클릭해도 아무 동작 없음 (원하면 다른 조건도 추가 가능)
                console.log("이 게시글은 상세 페이지 연결 없음:", src);
              }
            }}
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
