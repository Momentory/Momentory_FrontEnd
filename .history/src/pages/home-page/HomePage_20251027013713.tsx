import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopPlaces, getRecentPhotos, getMapPreview } from "../../api/home";
import Bg from "../../assets/bg.png";
import Char1 from "../../assets/char1.png"; // 캐릭터 이미지

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

      {/* 상단 배경 + 인사말 + 캐릭터 */}
      <div className="relative w-full h-[380px] overflow-hidden">
        {/* 하늘색 → 아이보리 그라데이션 */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#8DCCFF] to-[#FEFFEA]" />

        {/* 구름 배경 */}
        <img
          src={Bg}
          alt="하늘 배경"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* 인사말 */}
        <div className="relative z-10 px-6 pt-6 text-left">
          <p className="text-[15px] text-gray-800">
            안녕하세요{" "}
            <span className="font-semibold text-gray-900">{userName}</span>님
          </p>
          <p className="text-[14px] text-gray-700 mt-1">
            오늘은 어떤 사진을 찍어볼까요?
          </p>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 z-10">
          <img
            src={Char1}
            alt="캐릭터"
            className="w-[150px] h-auto drop-shadow-md"
          />
        </div>
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
          {/* 예시 카드 3개 */}
          <img
            src="/images/event1.png"
            alt="event"
            className="w-[180px] h-[120px] object-cover rounded-[12px]"
          />
          <img
            src="/images/event2.png"
            alt="event"
            className="w-[180px] h-[120px] object-cover rounded-[12px]"
          />
          <img
            src="/images/event3.png"
            alt="event"
            className="w-[180px] h-[120px] object-cover rounded-[12px]"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 mt-10">
        <h2 className="text-[17px] font-semibold mb-3">Categories</h2>
        <div className="bg-[#FF7070] rounded-[20px] p-4 flex justify-around text-white">
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
        <div className="rounded-[15px] overflow-hidden shadow-md">
          <img
            src="/images/sample-everland.jpg"
            alt="EVERLAND"
            className="w-full h-[160px] object-cover"
          />
          <div className="p-3">
            <p className="text-[15px] font-semibold">EVERLAND</p>
            <p className="text-[13px] text-gray-500">리뷰 4,321개 #놀이공원 #여행</p>
          </div>
        </div>
      </section>
    </div>
  );
}
