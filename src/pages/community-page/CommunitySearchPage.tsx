import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Tag } from "lucide-react";
import CommunityCard from "../../components/community/CommunityCard";

import {
  searchPostsByKeyword,
  searchPostsBySingleTag,
  type CommunityPost,
} from "../../api/community";

export default function CommunitySearchPage() {
  const navigate = useNavigate();

  /* ---------------------------- 상태 ---------------------------- */
  const [searchType, setSearchType] = useState<"title" | "tag">("title");
  const [keyword, setKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);

  const tags = [
    "고양시", "펫파크", "하남", "스타필드", "산",
    "바다", "공원", "카페", "휴양지", "빛",
  ];

  /* ---------------------------- 검색 실행 ---------------------------- */
  const handleSearch = async () => {
    setLoading(true);

    try {
      /* 제목/내용 검색 */
      if (searchType === "title") {
        if (!keyword.trim()) {
          setFilteredPosts([]);
          return;
        }

        const results = await searchPostsByKeyword(keyword);
        setFilteredPosts(results);
        return;
      }

      /* **태그 검색 (단일 태그 API 사용) */
      if (selectedTags.length === 0) {
        setFilteredPosts([]);
        return;
      }

      const firstTag = selectedTags[0];
      const results = await searchPostsBySingleTag(firstTag);
      setFilteredPosts(results);

    } catch (err) {
      console.error("검색 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- 태그 선택 ---------------------------- */
  const toggleTag = async (tag: string) => {
    let updated: string[];

    if (selectedTags.includes(tag)) {
      updated = selectedTags.filter((t) => t !== tag);
    } else {
      updated = [...selectedTags, tag];
    }

    setSelectedTags(updated);

    if (searchType === "tag") {
      if (updated.length === 0) {
        setFilteredPosts([]);
        return;
      }

      /* 태그 클릭 시 자동 검색 (첫 번째 태그만 사용) */
      setLoading(true);
      const firstTag = updated[0];
      const results = await searchPostsBySingleTag(firstTag);
      setFilteredPosts(results);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] pb-24">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white px-5 py-3">
        <div className="flex items-center gap-3">
          <img src="/images/menuIcon.png" className="w-[22px] h-[22px]" />
          <img src="/images/notificationIcon.png" className="w-[20px] h-[20px]" />
        </div>

        <div className="flex items-center gap-1 bg-white text-[#FF7070] px-3 py-[4px] rounded-full">
          <img src="/images/User.png" className="w-5 h-5" />
          <span className="text-[13px] font-medium">홍홍홍</span>
        </div>
      </header>

      {/* 제목 + 뒤로가기 */}
      <div className="relative flex items-center justify-center px-5 py-4 bg-white border-b border-gray-200">
        <img
          src="/images/109618.png"
          className="absolute left-5 w-[28px] h-[28px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[25px] font-semibold text-gray-800 text-center">
          검색
        </h1>
      </div>

      {/* 검색 방식 탭 */}
      <div className="flex justify-center px-5 py-4 bg-white border-gray-200">
        <div className="flex bg-[#F9FAFB] rounded-full p-[3px] shadow-inner">
          <button
            onClick={() => setSearchType("title")}
            className={`flex items-center justify-center gap-2 px-12 py-[8px] text-[11px] rounded-full ${searchType === "title"
              ? "bg-[#FFE5E5] text-[#333333]"
              : "bg-white text-[#666666]"
              }`}
          >
            <Search size={12} />
            제목/내용 검색
          </button>

          <button
            onClick={() => setSearchType("tag")}
            className={`flex items-center justify-center gap-2 px-12 py-[8px] text-[11px] rounded-full ${searchType === "tag"
              ? "bg-[#FFE5E5] text-[#333333]"
              : "bg-white text-[#666666]"
              }`}
          >
            <Tag size={12} />
            태그 검색
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
                ? "여행지, 제목, 내용 검색..."
                : "태그 검색..."
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 ml-2 text-[13px] text-gray-700 outline-none"
          />
        </div>
      </div>

      {/* 태그 필터 */}
      <div className="px-5 py-6">
        {searchType === "tag" && (
          <>
            <p className="text-[14px] text-gray-500 mb-3">
              태그를 클릭하여 필터링하세요 (여러 개 선택 가능)
            </p>

            <div className="grid grid-cols-5 gap-3">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`h-[40px] rounded-2xl text-[14px] flex items-center justify-center
              ${selectedTags.includes(tag)
                      ? "bg-[#FF7070] text-white"
                      : "bg-white border border-gray-300 text-gray-600"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </>
        )}

        {/* 검색 결과 */}
        <div className="space-y-5">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">검색중...</p>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <CommunityCard key={post.postId} post={post} />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
