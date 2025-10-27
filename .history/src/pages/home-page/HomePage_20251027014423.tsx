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
      {/* 상단: 레벨 + 포인트 */}
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

        {/* 캐릭터 */}
        <img
          src="/images/char1.png"
          alt="캐릭터"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[150px] h-auto drop-shadow-md"
        />
      </div>

      {/* Ongoing event */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[17px] font-semibold">Ongoing event</h2>
          <button className="text-[13px] text-gray-500 hover:text-[#FF7070] transition">
            see all &gt;
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          <div
            className="w-[180px] h-[120px] rounded-[12px] shadow"
            style={{
              backgroundImage: `url("/images/event1.png")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div
            className="w-[180px] h-[120px] rounded-[12px] shadow"
            style={{
              backgroundImage: `url("/images/event2.png")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div
            className="w-[180px] h-[120px] rounded-[12px] shadow"
            style={{
              backgroundImage: `url("/images/event3.png")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 mt-10">
        <h2 className="text-[17px] font-semibold mb-3">Categories</h2>
        <div
          className="rounded-[20px] p-4 flex justify-around text-white"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255,112,112,0.95), rgba(255,150,150,0.9)), url("/images/category-bg.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-[50px] h-[50px] bg-white/30 rounded-full flex items-center justify-center mb-1">
              🌱
            </div>
            <p className="text-[13px]">성장현황</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-[50px] h-[50px] bg-white/30 rounded-full flex items-center justify-center mb-1">
              📍
            </div>
            <p className="text-[13px]">나의지도</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-[50px] h-[50px] bg-white/30 rounded-full flex items-center justify-center mb-1">
              🖼️
            </div>
            <p className="text-[13px]">최근사진</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-[50px] h-[50px] bg-white/30 rounded-full flex items-center justify-center mb-1">
              🏕️
            </div>
            <p className="text-[13px]">추천여행</p>
          </div>
        </div>
      </section>

      {/* Recommended Places */}
      <section className="px-6 mt-10 mb-10">
        <h2 className="text-[17px] font-semibold mb-3">
          Recommended Places This Week
        </h2>
        <div
          className="rounded-[15px] overflow-hidden shadow-md"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,1)), url("/images/sample-everland.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="p-3 bg-white/70">
            <p className="text-[15px] font-semibold">EVERLAND</p>
            <p className="text-[13px] text-gray-500">
              리뷰 4,321개 #놀이공원 #여행
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
