import { useState } from "react";
import { Search, Filter } from "lucide-react"; 
// ↑ lucide-react 설치 필요: npm install lucide-react

export default function TravelPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 상단 검색 + 필터 바 */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        {/* 검색창 */}
        <div className="flex items-center w-[80%] bg-[#F3F4F6] rounded-full px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="여행지 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-[14px] w-full"
          />
        </div>

        {/* 필터 버튼 */}
        <button
          className="ml-3 flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#FF7070] text-white hover:bg-[#ff5a5a] transition"
          onClick={() => alert("필터 기능 준비 중!")}
        >
          <Filter size={18} />
        </button>
      </div>

      {/* 이후 여행지 카드 목록 등 */}
      <div className="p-4">
        <p className="text-gray-600 text-[15px]">
          여행지 검색 기능이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
