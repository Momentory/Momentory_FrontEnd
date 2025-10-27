import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopPlaces, getRecentPhotos, getMapPreview } from "../../api/home";

export default function HomePage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Username");
  const [level, setLevel] = useState(35);
  const [points, setPoints] = useState(1500);
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [mapPreview, setMapPreview] = useState<string | null>(null);

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
    <div className="w-full min-h-screen bg-white overflow-y-auto pb-24">
      {/* 상단 바 */}
      <div className="w-full bg-white flex justify-between items-center px-6 py-2 border-b border-gray-200 sticky top-0 z-20">
        <p className="text-[14px] font-semibold text-gray-800">Level {level}</p>
        <div className="flex items-center gap-1 text-[14px]">
          <div className="w-[20px] h-[20px] bg-[#FFD966] rounded-full flex items-center justify-center text-[13px] font-bold text-white">
            P
          </div>
          <span className="text-gray-700 font-medium">{points}</span>
        </div>
      </div>

      {/* 인사말 + 배경 + 캐릭터 */}
      <div
        className="relative w-full h-[380px] flex flex-col justify-start items-start px-6 pt-6"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(141,204,255,0.7), rgba(254,255,234,0.7)), url("/images/bg.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-left z-10">
          <p className="text-[15px] text-gray-800">
            안녕하세요{" "}
            <span className="font-semibold text-gray-900">{userName}</span>님
          </p>
          <p className="text-[14px] text-gray-700 mt-1">
            오늘은 어떤 사진을 찍어볼까요?
          </p>
        </div>

        <img
          src="/images/char1.png"
          alt="캐릭터"
          className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 w-[150px] h-auto drop-shadow-md"
        />

        <img
          src="/images/ground.png"
          alt="ground"
          className="absolute bottom-0 left-0 w-full"
        />
      </div>

      {/* 이벤트 섹션 */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[17px] font-semibold">진행중인 이벤트</h2>
          <button className="text-[13px] text-gray-500 hover:text-[#FF7070] transition">
            모두 보기&gt;
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          <img src="/images/event1.png" alt="event1" className="w-[180px] h-[120px] rounded-[12px] shadow-md object-cover" />
          <img src="/images/event2.png" alt="event2" className="w-[180px] h-[120px] rounded-[12px] shadow-md object-cover" />
          <img src="/images/event3.png" alt="event3" className="w-[180px] h-[120px] rounded-[12px] shadow-md object-cover" />
        </div>
      </section>

      {/* 카테고리 */}
      <section className="px-6 mt-10">
        <h2 className="text-[17px] font-semibold mb-3">카테고리</h2>
        <div
          className="rounded-[20px] p-4 flex justify-around text-white shadow-md"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255,112,112,0.95), rgba(255,150,150,0.9))`,
          }}
        >
          {[
            { img: "/images/sprout.png", label: "성장현황", link: "/character" },
            { img: "/images/location-pin.png", label: "나의지도", link: "/map" },
            { img: "/images/photo-gallery.png", label: "최근사진", link: "/album" },
            { img: "/images/star.png", label: "추천여행", link: "/travel" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="w-[50px] h-[50px] bg-white/30 rounded-full flex items-center justify-center mb-1">
                <img src={item.img} alt={item.label} className="w-[32px] h-auto" />
              </div>
              <p className="text-[13px]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 최근 업로드 사진 */}
      <section className="px-6 mt-10">
        <h2 className="text-[17px] font-semibold mb-3">최근 업로드 사진</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {recentPhotos.length > 0 ? (
            recentPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.imageUrl}
                alt="최근사진"
                className="w-[150px] h-[100px] object-cover rounded-[10px] shadow-md"
              />
            ))
          ) : (
            <p className="text-[13px] text-gray-400">최근 업로드된 사진이 없습니다.</p>
          )}
        </div>
      </section>

      {/* 추천 여행지 */}
      <section className="px-6 mt-10 mb-10">
        <h2 className="text-[17px] font-semibold mb-3">이번 주 추천 장소</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {topPlaces.length > 0 ? (
            topPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => navigate(`/travel/${place.id}`)}
                className="rounded-[15px] overflow-hidden shadow-md min-w-[230px] bg-white"
              >
                <img src={place.imageUrl} alt={place.name} className="w-full h-[130px] object-cover" />
                <div className="p-3 bg-white">
                  <p className="text-[15px] font-semibold flex items-center justify-between">
                    {place.name}
                    <span className="flex items-center text-[13px] text-[#FF7070] font-medium">
                      <img src="/images/star.png" alt="star" className="w-[14px] h-[14px] mr-1" />
                      {place.rating.toFixed(1)}
                    </span>
                  </p>
                  <p className="text-[13px] text-gray-500">
                    리뷰 {place.reviewCount.toLocaleString()}개
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-400">추천 여행지가 없습니다.</p>
          )}
        </div>
      </section>
      {/* 지도 미리보기 섹션 */}
      <section className="px-6 mt-10 mb-10">
        <h2 className="text-[17px] font-semibold mb-3">My Map Preview</h2>
        {mapPreview ? (
          <div
             className="rounded-[15px] overflow-hidden shadow-md"
             onClick={() => navigate("/map")}
         >
           <img
              src={mapPreview}
              alt="나의 지도 미리보기"
              className="w-full h-[180px] object-cover"
          />
       </div>
     ) : (
       <p className="text-[13px] text-gray-400">아직 지도 미리보기가 없습니다.</p>
     )}
    </section>

    </div>
  );
}
