import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopPlaces, getRecentPhotos, getMapPreview } from "../../api/home";

// 컴포넌트 import
import MapPopup from "../../components/home/MapPopup";
import UploadPopup from "../../components/home/UploadPopup";
import DropdownMenu from "../../components/home/DropdownMenu";

export default function HomePage() {
  const navigate = useNavigate();

  const [userName] = useState("Username");
  const [level] = useState(35);
  const [points] = useState(1500);
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [mapPreview, setMapPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 팝업 상태
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <img src="/images/loading.gif" alt="로딩중" className="w-[60px] mb-3" />
        데이터를 불러오는 중이에요...
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        데이터를 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto pb-28 relative">
      {/* 🔹 상단 헤더 */}
      <div className="w-full bg-[#FF8A8A] flex justify-between items-center px-5 py-3 sticky top-0 z-30 text-white">
        <div className="flex flex-col leading-tight">
          <p className="text-[14px] font-semibold">Level {level}</p>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 text-[14px] font-medium"
          >
            <img
              src="/icons/profile.png"
              alt="프로필"
              className="w-[22px] h-[22px] rounded-full bg-white/40"
            />
            {userName} ▼
          </button>

          {showDropdown && (
            <DropdownMenu onClose={() => setShowDropdown(false)} />
          )}

          <div className="flex items-center bg-white/25 px-2 py-[2px] rounded-full text-[13px]">
            <div className="w-[20px] h-[20px] bg-[#FFD966] rounded-full flex items-center justify-center text-[12px] font-bold text-white mr-1">
              P
            </div>
            {points}
          </div>
        </div>
      </div>

      {/* 🔹 인사말 + 캐릭터 */}
      <div
        className="relative w-full h-[380px] flex flex-col justify-start items-start px-6 pt-6"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(141,204,255,0.7), rgba(254,255,234,0.7)), url("/images/bg.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-left z-10">
          <p className="text-[15px] text-gray-800">
            안녕하세요 <span className="font-semibold">{userName}</span>님
          </p>
          <p className="text-[14px] text-gray-700 mt-1">
            오늘은 어떤 사진을 찍어볼까요?
          </p>
        </div>

        <img
          src="/images/char1.png"
          alt="캐릭터"
          className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[150px]"
        />
        <img
          src="/images/ground.png"
          alt="ground"
          className="absolute bottom-0 left-0 w-full h-[100px] object-cover"
        />
      </div>

      {/* 🔹 이벤트 */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[17px] font-semibold">진행중인 이벤트</h2>
          <button className="text-[13px] text-gray-500 hover:text-[#FF7070]">
            모두 보기 &gt;
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`/images/event${i}.png`}
              alt={`event${i}`}
              className="w-[180px] h-[120px] rounded-[12px] shadow-md object-cover"
            />
          ))}
        </div>
      </section>

      {/* 🔹 카테고리 */}
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
            { img: "/images/location-pin.png", label: "나의지도", action: () => setShowMapPopup(true) },
            { img: "/images/photo-gallery.png", label: "최근사진", link: "/album" },
            { img: "/images/star.png", label: "추천여행", link: "/travel" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition"
              onClick={() => item.action ? item.action() : navigate(item.link ?? "")}
            >
              <div className="w-[50px] h-[50px] bg-white/30 rounded-full flex items-center justify-center mb-1">
                <img src={item.img} alt={item.label} className="w-[30px]" />
              </div>
              <p className="text-[13px]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 추천 장소 */}
      <section className="px-6 mt-10 mb-28">
        <h2 className="text-[17px] font-semibold mb-3">이번 주 추천 장소</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {topPlaces.map((place) => (
            <div
              key={place.id}
              className="min-w-[230px] rounded-[15px] overflow-hidden shadow-md bg-white"
              onClick={() => navigate(`/travel/${place.id}`)}
            >
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-[130px] object-cover"
              />
              <div className="p-3">
                <p className="font-semibold text-[15px] flex justify-between">
                  {place.name}
                  <span className="flex items-center text-[#FF7070] text-[13px]">
                    <img
                      src="/images/star.png"
                      alt="star"
                      className="w-[14px] h-[14px] mr-1"
                    />
                    {place.rating ?? "4.0"}
                  </span>
                </p>
                <p className="text-[13px] text-gray-500">
                  리뷰 {place.reviewCount ?? 0}개
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 팝업 모음 */}
      {showMapPopup && <MapPopup onClose={() => setShowMapPopup(false)} />}
      {showUploadPopup && <UploadPopup onClose={() => setShowUploadPopup(false)} />}
    </div>
  );
}
