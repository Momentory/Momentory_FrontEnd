import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ArrowLeft } from "lucide-react";

export default function TravelPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  //  임시 여행지 데이터
  const [places] = useState([
    { id: 1, name: "남한산성", location: "광주시", category: "역사" },
    { id: 2, name: "에버랜드", location: "용인시", category: "놀이" },
    { id: 3, name: "수원화성", location: "수원시", category: "문화" },
    { id: 4, name: "가평 아침고요수목원", location: "가평군", category: "자연" },
  ]);

  // 검색 필터링
  const filteredPlaces = places.filter(
    (p) =>
      p.name.includes(searchQuery) ||
      p.location.includes(searchQuery) ||
      p.category.includes(searchQuery)
  );

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 상단 바 */}
      <div className="sticky top-0 z-20 bg-white flex flex-col shadow-sm">
        {/* 상단 아이콘 바 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          {/* 뒤로가기 */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>

          {/* 검색창 */}
          <div className="flex items-center w-[70%] bg-[#F3F4F6] rounded-full px-3 py-2">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="여행지 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-[14px] w-full"
            />
          </div>

          {/* 필터 */}
          <button
            className="ml-3 flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#FF7070] text-white hover:bg-[#ff5a5a] transition"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* 대표 이미지 배너 */}
        <div className="w-full h-[180px] relative">
          <img
            src="/images/travel-banner.png"
            alt="여행 배너"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-70" />
        </div>
      </div>

      {/* 필터 모달 */}
      {filterVisible && (
        <div className="absolute top-[70px] right-4 bg-white rounded-lg shadow-md p-3 z-30">
          <p className="text-sm text-gray-700 mb-1">정렬 기준</p>
          <button className="text-[14px] w-full text-left hover:text-[#FF7070]">
            🔹 가나다순
          </button>
          <button className="text-[14px] w-full text-left hover:text-[#FF7070]">
            🔹 인기순
          </button>
        </div>
      )}

      {/* 여행지 목록 */}
      <div className="p-4 space-y-3">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition"
          >
            <p className="text-[16px] font-semibold text-gray-800">
              {place.name}
            </p>
            <p className="text-[13px] text-gray-500">
              {place.location} · {place.category}
            </p>
          </div>
        ))}

        {filteredPlaces.length === 0 && (
          <p className="text-center text-gray-400 text-[14px] mt-10">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
