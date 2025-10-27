import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlaces } from "../../api/home";

export default function TravelPage() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    // 여행지 전체 목록 로드
    getAllPlaces()
      .then((res) => setPlaces(res))
      .catch(() => console.log("여행지 목록 로드 실패"));
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FFFDFD] px-6 pt-6 pb-20 relative">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-[15px] hover:text-[#FF7070] transition"
        >
          ←
        </button>
        <h1 className="text-[20px] font-semibold text-gray-800">
          추천 장소
        </h1>
        <div className="w-[25px]"></div> {/* 오른쪽 여백 균형 */}
      </div>

      {/* 여행지 카드 목록 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {places.map((place, i) => (
          <div
            key={i}
            className="bg-white rounded-[15px] shadow-md overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-200"
            onClick={() => navigate(`/place/${place.id}`)}
          >
            {/* 썸네일 */}
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-[130px] object-cover"
            />

            {/* 정보 */}
            <div className="p-3">
              <p className="text-[15px] font-semibold text-gray-800 truncate">
                {place.name}
              </p>
              <p className="text-[13px] text-gray-500 truncate">
                {place.location}
              </p>

              {/* 별점 or 좋아요 자리 (나중) */}
              <div className="flex justify-end mt-1">
                <p className="text-[12px] text-gray-400">⭐ 4.7</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 공백 */}
      <div className="h-[60px]" />
    </div>
  );
}
