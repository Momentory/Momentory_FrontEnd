import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopPlaces, getRecentPhotos, getMapPreview } from "../../api/home";

// ❗️ 'public' 폴더의 이미지는 import하지 않으므로 관련 라인을 삭제했습니다.

export default function HomePage() {
  const navigate = useNavigate();

  // 상태 관리 (기존과 동일)
  const [userName, setUserName] = useState("Username");
  const [level, setLevel] = useState(35);
  const [points, setPoints] = useState(1500);
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [mapPreview, setMapPreview] = useState<string | null>(null);

  // 데이터 로드 (기존과 동일)
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [places, photos, map] = await Promise.all([
          getTopPlaces(),
          getRecentPhotos(),
          getMapPreview(),
        ]);
        setTopPlaces(places);
        setRecentPhotos(photos);
        setMapPreview(map.previewUrl);
      } catch (e) {
        console.log("홈 데이터 로드 실패", e);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 상단: 레벨 + 포인트 (기존과 동일) */}
      <div className="w-full bg-white flex justify-between items-center px-6 py-2 border-b border-gray-200">
        <p className="text-[14px] font-semibold text-gray-800">Level {level}</p>
        <div className="flex items-center gap-1 text-[14px]">
          <div className="w-[20px] h-[20px] bg-[#FFD966] rounded-full flex items-center justify-center text-[13px] font-bold text-white">
            P
          </div>
          <span className="text-gray-700 font-medium">{points}</span>
        </div>
      </div>

      {/* --- 💅 수정된 부분 시작 --- */}
      {/* 인사말 + 배경 */}
      <div
        className="relative w-full h-[450px] overflow-hidden bg-cover bg-center"
        style={{
          // 배경에 그라디언트와 이미지를 동시에 적용합니다.
          // public 폴더의 이미지는 '/images/bg.png'와 같이 문자열로 바로 사용합니다.
          backgroundImage: `linear-gradient(to bottom, rgba(141, 204, 255, 0.7), rgba(254, 255, 234, 0.7)), url("/images/bg.png")`,
        }}
      >
        {/* 인사말 텍스트 */}
        <div className="relative z-10 px-6 pt-6 text-left">
          <p className="text-[15px] text-gray-800">
            안녕하세요 <span className="font-semibold text-gray-900">{userName}</span>님
          </p>
          <p className="text-[14px] text-gray-700 mt-1">
            오늘은 어떤 사진을 찍어볼까요?
          </p>
        </div>

        {/* 여기에 캐릭터 이미지 등을 추가로 배치할 수 있습니다 */}
      </div>
      {/* --- 수정된 부분 끝 --- */}


      {/* 본문 콘텐츠 (기존과 동일) */}
      <div className="px-6 pt-6 pb-24 space-y-8">
        {/* 오늘의 여행지 Top 3 */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[17px] font-semibold">오늘의 여행지 Top 3</h2>
            <button
              onClick={() => navigate("/travel")}
              className="text-[13px] text-gray-500 hover:text-[#FF7070] transition"
            >
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
        <section>
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
        <section>
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