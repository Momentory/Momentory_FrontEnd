import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Username");
  const [level, setLevel] = useState(35);
  const [points, setPoints] = useState(1500);
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [mapPreview, setMapPreview] = useState<string | null>(null);

  useEffect(() => {
    api.get("/api/home/travel-top3")
      .then((res) => setTopPlaces(res.data))
      .catch(() => console.log("여행지 불러오기 실패"));

    api.get("/api/home/recent-photos")
      .then((res) => setRecentPhotos(res.data))
      .catch(() => console.log("사진 불러오기 실패"));

    api.get("/api/home/map-preview")
      .then((res) => setMapPreview(res.data.imageUrl))
      .catch(() => console.log("지도 미리보기 불러오기 실패"));
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 상단: 레벨 + 포인트 */}
      <div className="w-full bg-white flex justify-between items-center px-6 py-2 border-b border-gray-200">
        <p className="text-[14px] font-semibold text-gray-800">
          Level {level}
        </p>
        <div className="flex items-center gap-1 text-[14px]">
          <div className="w-[20px] h-[20px] bg-[#FFD966] rounded-full flex items-center justify-center text-[13px] font-bold text-white">
            P
          </div>
          <span className="text-gray-700 font-medium">{points}</span>
        </div>
      </div>

     {/* 인사말 + 배경 영역 (Figma 그라데이션 적용) */}
<div
  className="relative w-full h-[180px] flex flex-col justify-center px-6 bg-gradient-to-b from-[#8DCCFF] to-[#FEFFEA]"
>
  <div>
    <p className="text-[15px] text-gray-700">
      안녕하세요{" "}
      <span className="font-semibold text-gray-900">{userName}</span>님
    </p>
    <p className="text-[14px] text-gray-600">
      오늘은 어떤 사진을 찍어볼까요?
    </p>
  </div>
</div>


      {/* 이하 나머지 섹션 (Top3, 최근사진, 지도 등은 그대로 유지) */}
      <div className="px-6 pt-5 pb-16">
        {/* 오늘의 여행지 Top 3 */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[17px] font-semibold">오늘의 여행지 Top 3</h2>
            <button className="text-[13px] text-gray-500 hover:text-[#FF7070] transition">
              더보기 &gt;
            </button>
          </div>
          <div className="flex overflow-x-auto gap-3 scrollbar-hide">
            {topPlaces.map((place, i) => (
              <div
                key={i}
                className="min-w-[200px] rounded-[12px] overflow-hidden shadow hover:scale-105 transition cursor-pointer"
                onClick={() => navigate(`/place/${place.id}`)}
              >
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-[130px] object-cover"
                />
                <div className="p-2">
                  <p className="text-[15px] font-semibold">{place.name}</p>
                  <p className="text-[13px] text-gray-500">{place.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 최근 업로드한 사진 */}
        <section className="mb-6">
          <h2 className="text-[17px] font-semibold mb-2">최근 업로드한 사진</h2>
          <div className="grid grid-cols-3 gap-2">
            {recentPhotos.map((photo, i) => (
              <img
                key={i}
                src={photo.url}
                alt="recent"
                className="w-full h-[100px] object-cover rounded-[10px]"
              />
            ))}
          </div>
        </section>

        {/* 지도 미리보기 */}
        <section className="mb-10">
          <h2 className="text-[17px] font-semibold mb-2">나의 지도</h2>
          {mapPreview ? (
            <img
              src={mapPreview}
              alt="지도 미리보기"
              className="w-full h-[150px] rounded-[12px] object-cover shadow cursor-pointer"
              onClick={() => navigate("/map")}
            />
          ) : (
            <div className="w-full h-[150px] rounded-[12px] bg-[#F2F4F8] flex items-center justify-center border border-gray-200">
              <p className="text-gray-500 text-[14px]">지도 미리보기 로드 중...</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
