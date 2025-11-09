import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Tag } from "lucide-react";
import CommunityCard from "../../components/community/CommunityCard";

export default function CommunitySearchPage() {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState<"title" | "tag">("title");
    const [keyword, setKeyword] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tags = ["고양시", "펫파크", "하남", "스타필드", "산", "바다", "공원", "카페", "휴양지", "빛"];

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const posts = [
        {
            id: 1,
            author: "여행하는물고기",
            time: "12분 전",
            imageUrl: "/images/image51.png",
            title: "이번 주말 다녀온 고양시 스타필드!",
            content:
                "경기도 고양시 덕양구 스타필드에 다녀왔어요. 조명이 너무 예뻐서 가족들과 즐거운 시간을 보냈어요.",
            tags: ["#고양시", "#펫파크", "#하남"],
            likeCount: 125,
            commentCount: 15,
        },
    ];

    return (
        <div className="w-full min-h-screen bg-[#F9FAFB] pb-24">
            {/* 상단 헤더 */}
            <header className="flex items-center justify-between bg-[#FF7070] text-white px-5 py-3">
                <div className="flex items-center gap-3">
                    <button>
                        <img src="/images/menuIcon.png" alt="menu" className="w-[22px] h-[22px]" />
                    </button>
                    <button>
                        <img
                            src="/images/notificationIcon.png"
                            alt="notification"
                            className="w-[20px] h-[20px]"
                        />
                    </button>
                </div>

                <div className="flex items-center gap-1 bg-white text-[#FF7070] px-3 py-[4px] rounded-full">
                    <img src="/images/User.png" alt="User" className="w-5 h-5" />
                    <span className="text-[13px] font-medium">Username</span>
                </div>
            </header>

            {/* 제목 + 뒤로가기 */}
            <div className="relative flex items-center justify-center px-5 py-4 bg-white border-b border-gray-200">
                <img
                    src="/images/109618.png"
                    alt="뒤로가기"
                    className="absolute left-5 w-[28px] h-[28px] cursor-pointer hover:opacity-80 transition"
                    onClick={() => navigate(-1)}
                />
                {/* 중앙 제목 */}
                <h1 className="text-[25px] font-semibold text-gray-800 text-center">
                    검색
                </h1>
            </div>


            <div className="flex justify-center px-5 py-4 bg-white border-gray-200">
                <div className="flex bg-[#F9FAFB] rounded-full p-[3px] shadow-inner">
                    {/* 제목/내용 검색 */}
                    <button
                        onClick={() => setSearchType("title")}
                        className={`flex items-center justify-center gap-2 px-12 py-[8px] text-[11px] font-medium transition-all duration-200 rounded-full ${searchType === "title"
                            ? "bg-[#FFE5E5] text-[#333333] shadow-sm"
                            : "bg-white text-[#666666]"
                            }`}
                    >
                        <Search size={16} />
                        <span>제목/내용 검색</span>
                    </button>

                    {/* 태그 검색 */}
                    <button
                        onClick={() => setSearchType("tag")}
                        className={`flex items-center justify-center gap-2 px-12 py-[8px] text-[11px] font-medium transition-all duration-200 rounded-full ${searchType === "tag"
                            ? "bg-[#FFE5E5] text-[#333333] shadow-sm"
                            : "bg-white text-[#666666]"
                            }`}
                    >
                        <Tag size={16} />
                        <span>태그 검색</span>
                    </button>
                </div>
            </div>

            {/* 검색창 */}
            <div className="px-5 mt-1">
                <div className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 shadow-sm">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={
                            searchType === "title"
                                ? "여행지, 제목, 내용으로 검색..."
                                : "태그 내용으로 검색..."
                        }
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="flex-1 ml-2 text-[13px] text-gray-700 outline-none"
                    />
                </div>
            </div>

            {/* 본문 영역 */}
            <div className="px-5 py-6">
                {searchType === "tag" && (
                    <>
                        <p className="text-[14px] text-gray-500 mb-3">
                            태그를 클릭하여 필터링하세요 (여러 개 선택 가능)
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-4 py-[6px] rounded-full text-[14px] transition ${selectedTags.includes(tag)
                                        ? "bg-[#FF7070] text-white"
                                        : "bg-[#F9FAFB] border border-gray-300 text-gray-600"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* 결과 카드 */}
                <CommunityCard
                    imageUrl={posts[0].imageUrl}
                    title={posts[0].title}
                    content={posts[0].content}
                    tags={posts[0].tags}
                    time={posts[0].time}
                    likeCount={posts[0].likeCount}
                    commentCount={posts[0].commentCount}
                />
            </div>
        </div>
    );
}
