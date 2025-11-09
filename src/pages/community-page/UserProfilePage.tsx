import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";

export default function UserProfilePage() {
  const navigate = useNavigate();
  // const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<"list" | "scrap" | "like">("list");
  const [backgroundImage, setBackgroundImage] = useState("/images/city.png");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  const posts = [
    "/images/image51.png",
    "/images/everland.png",
    "/images/pyeongtaek.png",
    "/images/yongin.png",
    "/images/icheon.png",
    "/images/suwon.png",
  ];

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

      {/* 배경 이미지 */}
      <div
        className="relative w-full max-w-[480px] h-[180px] overflow-hidden cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <img
          src={backgroundImage}
          alt="배경"
          className="absolute w-full h-full object-cover brightness-[0.45]"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBackgroundChange}
        />
      </div>

      {/* 프로필 영역 */}
      <div className="w-full max-w-[480px] px-[15px] mt-[-35px] relative z-10 flex flex-col items-start">
        <img
          src="/images/profile.png"
          alt="프로필"
          className="w-[80px] h-[80px] rounded-full object-cover shadow-md  bg-white"
        />

        {/* 닉네임 + 팔로우 버튼 한 줄 */}
        <div className="flex items-center justify-between w-full mt-[10px] pr-4">
          <h2 className="text-[17px] font-semibold text-gray-800">
            여행하는물개
          </h2>
          <button
            onClick={() => setIsFollowed(!isFollowed)}
            className={`text-white text-[13px] px-4 py-[5px] rounded-full font-medium active:scale-95 transition ${
              isFollowed ? "bg-gray-400" : "bg-[#FF7070]"
            }`}
          >
            {isFollowed ? "팔로잉" : "팔로우"}
          </button>
        </div>

        {/* 소개글 */}
        <p className="text-[13px] text-gray-500 leading-snug w-[280px] mt-[3px]">
          새로운 곳과 낯선 곳에서 새로운 발견을 즐깁니다.
        </p>

        {/* 링크 */}
        <a
          href="https://www.figma.com/domentry"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-[#2C6BED] underline mt-[2px] block"
        >
          https://www.figma.com/domentry
        </a>

        {/* 팔로잉 / 팔로워 */}
        <div className="flex items-center gap-6 mt-4">
          <p className="text-[9px] text-gray-700">
            <span className="font-semibold text-[9px] text-black-800">412</span>{" "}
            팔로잉
          </p>
          <p className="text-[9px] text-gray-700">
            <span className="font-semibold text-[9px] text-black-800">415</span>{" "}
            팔로워
          </p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-center items-center gap-[120px] mt-[30px] mb-[2px]">
        <button
          onClick={() => setActiveTab("list")}
          className={`transition ${
            activeTab === "list" ? "opacity-100" : "opacity-40"
          }`}
        >
          <img src="/images/list.png" alt="내 글" className="w-[25px] h-[25px]" />
        </button>
        <button
          onClick={() => setActiveTab("scrap")}
          className={`transition ${
            activeTab === "scrap" ? "opacity-100" : "opacity-40"
          }`}
        >
          <img src="/images/mark.png" alt="스크랩" className="w-[25px] h-[25px]" />
        </button>
        <button
          onClick={() => setActiveTab("like")}
          className={`transition ${
            activeTab === "like" ? "opacity-100" : "opacity-40"
          }`}
        >
          <img src="/images/Heart.png" alt="좋아요" className="w-[25px] h-[25px]" />
        </button>
      </div>

      {/* 게시물 목록 */}
      <div className="grid grid-cols-3 gap-[4px] mt-[20px] px-2 w-full max-w-[480px] mb-[80px]">
        {posts.map((src, idx) => (
          <div key={idx} className="aspect-square">
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
