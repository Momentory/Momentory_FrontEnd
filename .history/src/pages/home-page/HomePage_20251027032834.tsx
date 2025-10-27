import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTopPlaces, getRecentPhotos, getMapPreview } from "../../api/home";
import { X } from "lucide-react";
import DropdownMenu from "../../components/home/DropdownMenu";

export default function HomePage() {
  const navigate = useNavigate();

  // 유저 기본 데이터
  const [userName, setUserName] = useState("Username");
  const [level, setLevel] = useState(35);
  const [points, setPoints] = useState(1500);

  // API 데이터
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [mapPreview, setMapPreview] = useState<string | null>(null);

  // 로딩/에러 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 지도 모달 상태
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // ✅ 드롭다운 상태 및 참조
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 홈 데이터 불러오기
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const [places, photos, map] = await Promise.all([
          getTopPlaces(),
          getRecentPhotos(),
          getMapPreview(),
        ]);
        setTopPlaces(places);
        setRecentPhotos(photos);
        setMapPreview(map.previewUrl);
      } catch (e) {
        console.error("홈 데이터 로드 실패:", e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // 로딩 화면
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <img src="/images/loading.gif" alt="로딩중" className="w-[60px] mb-3" />
        데이터를 불러오는 중이에요...
      </div>
    );

  // 에러 화면
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        데이터를 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto pb-28 relative">
      {/* ✅ 상단바 */}
      <div
        className="w-full bg-[#FF7F7F] flex justify-between items-center px-6 py-3 sticky top-0 z-30 text-white"
        ref={dropdownRef}
      >
        {/* 왼쪽: Username + ▼ */}
        <div className="flex items-center gap-2 relative">
          <img
            src="/images/profile.png"
            alt="프로필"
            className="w-[28px] h-[28px] rounded-full bg-white/30"
          />
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 font-medium hover:opacity-90 transition"
          >
            {userName}
            <span className="text-[12px] ml-1">▼</span>
          </button>

          {/* ✅ DropdownMenu (Username 바로 아래 표시) */}
          {showDropdown && (
            <div className="absolute top-[115%] left-[35px]">
              <DropdownMenu onClose={() => setShowDropdown(false)} />
            </div>
          )}
        </div>

        {/* 오른쪽: 포인트 */}
        <div className="flex items-center gap-1 text-[14px]">
          <div className="w-[22px] h-[22px] bg-[#FFD966] rounded-full flex items-center justify-center text-[13px] font-bold text-white">
            P
          </div>
          <span className="font-medium">{points}</span>
        </div>
      </div>

      {/* 인사말 + 캐릭터 */}
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
          className="absolute bottom-0 w-full h-[100px] object-cover"
          style={{ left: 0 }}
        />
      </div>

      {/* 진행중인 이벤트 */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[17px] font-semibold">진행중인 이벤트</h2>
          <button className="text-[13px] text-gray-500 hover:text-[#FF7070]">
            모두 보기&gt;
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
            {
              img: "/images/location-pin.png",
              label: "나의지도",
              onClick: () => setIsMapModalOpen(true),
            },
            {
              img: "/images/photo-gallery.png",
              label: "최근사진",
              link: "/album",
            },
            { img: "/images/star.png", label: "추천여행", link: "/travel" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition"
              onClick={item.onClick ?? (() => navigate(item.link))}
            >
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
            <p className="text-[13px] text-gray-400">
              최근 업로드된 사진이 없습니다.
            </p>
          )}
        </div>
      </section>

      {/* 추천 장소 */}
      <section className="px-6 mt-10">
        <h2 className="text-[17px] font-semibold mb-3">이번 주 추천 장소</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {topPlaces.length > 0 ? (
            topPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => navigate(`/travel/${place.id}`)}
                className="rounded-[15px] overflow-hidden shadow-md min-w-[230px]"
              >
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-[130px] object-cover"
                />
                <div className="p-3 bg-white">
                  <p className="text-[15px] font-semibold flex justify-between">
                    {place.name}
                    <span className="flex items-center text-[#FF7070] text-[13px]">
                      <img
                        src="/images/star.png"
                        alt="star"
                        className="w-[14px] h-[14px] mr-1"
                      />
                      {place.rating?.toFixed(1) ?? "4.0"}
                    </span>
                  </p>
                  <p className="text-[13px] text-gray-500">
                    리뷰 {place.reviewCount?.toLocaleString() ?? "0"}개
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-400">추천 여행지가 없습니다.</p>
          )}
        </div>
      </section>

      {/* 나의 지도 미리보기 */}
      <section className="px-6 mt-10 mb-28">
        <h2 className="text-[17px] font-semibold mb-3">나의 지도 미리보기</h2>
        {mapPreview ? (
          <div
            className="rounded-[15px] overflow-hidden shadow-md cursor-pointer active:scale-95 transition"
            onClick={() => setIsMapModalOpen(true)}
          >
            <img
              src={mapPreview}
              alt="나의 지도 미리보기"
              className="w-full h-[180px] object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 py-10 border border-dashed border-gray-200 rounded-[15px]">
            <p className="text-[14px] mb-1">아직 지도 미리보기가 없습니다.</p>
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="text-[#FF7070] text-[13px] font-medium mt-2 hover:underline"
            >
              내 지도 보러가기 →
            </button>
          </div>
        )}
      </section>

      {/* 지도 모달 */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-[20px] shadow-lg w-[300px] p-4 relative flex flex-col items-center">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-3 left-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-[16px] font-semibold mb-3 mt-1">
              나의 경기지도
            </h2>

            <img
              src={mapPreview || "/images/map-preview.png"}
              alt="나의 지도"
              className="w-[220px] h-auto rounded-[10px] border border-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
