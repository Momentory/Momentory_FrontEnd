import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTopPlaces,
  getRecentPhotos,
  getCharacterStatus,
  getEvents,
  getMyPoint,
  getMyMapInfo
} from "../../api/home";
import { X } from "lucide-react";
import GyeonggiMap from './GyeonggiMap';

export default function HomePage() {
  const navigate = useNavigate();

  // 유저 기본 데이터
  const [userName, setUserName] = useState("Username");
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);

  // 상태
  const [isDropdownOpen, _setIsDropdownOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [_isError, setIsError] = useState(false);

  // API 데이터
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const [mapColors, setMapColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);

        //병렬로 API 호출
        const [
          places,
          photos,
          charStatus,
          evts,
          pointData,
          mapData
        ] = await Promise.all([
          getTopPlaces(),
          getRecentPhotos(),
          getCharacterStatus(),
          getEvents(),
          getMyPoint(),
          getMyMapInfo()
        ]);

        // 여행지 / 사진
        setTopPlaces(Array.isArray(places) ? places : []);
        setRecentPhotos(Array.isArray(photos) ? photos : []);

        // 캐릭터 상태 
        if (charStatus) {
          setUserName(charStatus.nickname ?? "User");
          setLevel(charStatus.level ?? 0);
        }

        // 포인트 
        if (pointData) {
          setPoints(pointData.userPoint?.currentPoint ?? 0);
        }

        // 이벤트
        setEvents(Array.isArray(evts) ? evts : []);

        // 지도 색깔 저장
        setMapColors(mapData ?? {});

      } catch (e) {
        console.error("홈 데이터 로드 실패:", e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto relative mt-[60px]">
      {/* 상단바 */}
      <div className="w-full bg-white flex justify-between items-center px-6 py-2 border-b border-gray-200 sticky top-0 z-30">
        <p className="text-[14px] font-semibold text-gray-800">
          Level {level}
        </p>
        <div className="relative flex items-center gap-1 text-[14px]">
          {isDropdownOpen && (
            <div className="absolute right-0 top-[28px] bg-white border rounded-[10px] shadow-md py-2 w-[120px] z-40">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                프로필 수정
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                로그아웃
              </button>
            </div>
          )}
          <div className="w-[20px] h-[20px] bg-[#FFD966] rounded-full flex items-center justify-center text-[13px] font-bold text-white">
            P
          </div>
          <span className="text-gray-700 font-medium">{points}</span>
        </div>
      </div>

      {/* 인사 + 캐릭터 */}
      <div
        className="relative w-full h-[380px] flex flex-col justify-start items-start px-6 pt-6"
        style={{
          backgroundImage: "url('/images/bgImage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[86px] bg-black/35 z-[2] flex flex-col justify-center px-[20px]">
          <p className="text-[15px] text-white font-medium">
            안녕하세요 <span className="font-bold">{userName}</span>님
          </p>
          <p className="text-[14px] text-white mt-1 opacity-90">
            오늘은 어떤 사진을 찍어볼까요?
          </p>
        </div>

        <img
          src="/images/char1.png"
          alt="캐릭터"
          className="absolute left-1/2 -translate-x-1/4 z-1"
          style={{ width: "380px", height: "430px", bottom: "-60px" }}
        />
        <img
          src="/images/ribon.png"
          alt="리본"
          className="absolute z-4"
          style={{
            width: "76px",
            height: "48px",
            bottom: "118px",
            left: "43%",
          }}
        />
      </div>

      {/* 진행중인 이벤트 */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[23px] font-extrabold text-gray-900">
            진행중인 이벤트
          </h2>
          <button className="text-[13px] text-gray-500 hover:text-[#FF7070]">
            모두 보기 &gt;
          </button>
        </div>

        <div className="relative">
          <div className="grid grid-cols-3 gap-3 pb-3">
            {(events.length > 0 ? events : [1, 2, 3]).map((evt: any, i) => (
              <div
                key={i}
                className="relative w-full h-[146px] rounded-[12px] overflow-hidden shadow-md bg-white"
              >
                <img
                  src={evt.imageUrl ?? `/images/event${i + 1}.png`}
                  alt={evt.title ?? `event${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* 인디케이터 */}
          <div className="flex justify-center items-center mt-2 gap-[6px]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-[7px] h-[7px] rounded-full ${i === 1 ? "bg-[#FF7070]" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 최신 업로드 사진 */}
      {recentPhotos.length > 0 && (
        <section className="px-6 mt-10">
          <h2 className="text-[23px] font-semibold mb-3">최근 업로드된 사진</h2>
          <div className="grid grid-cols-3 gap-3">
            {recentPhotos.slice(0, 3).map((photo: any, idx: number) => (
              <div
                key={idx}
                className="w-full h-[120px] rounded-[12px] overflow-hidden shadow-md bg-gray-100"
              >
                <img
                  src={photo.imageUrl ?? "/images/default.png"}
                  alt={`photo-${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 카테고리 */}
      <section className="px-6 mt-10">
        <div
          className="rounded-[20px] px-5 py-4 shadow-md text-white"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,112,112,0.95), rgba(255,150,150,0.9))",
          }}
        >
          <h2 className="text-[23px] font-extrabold mb-3">카테고리</h2>
          <div className="flex justify-around">
            {[
              {
                img: "/images/sprout.png",
                label: "성장현황",
                link: "/character",
              },
              {
                img: "/images/location-pin.png",
                label: "나의지도",
                onClick: () => setIsMapModalOpen(true),
              },
              {
                img: "/images/roulette.png",
                label: "여행지 추천",
                link: "/recommended-places",
              },
              { img: "/images/star.png", label: "스탬프", link: "stamp-acquisition" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition"
                onClick={item.onClick ?? (() => navigate(item.link ?? ""))}
              >
                <div className="w-[58px] h-[58px] bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-[28px] h-auto"
                  />
                </div>
                <p className="text-[13px] text-white font-semibold">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 여행지 */}
      <section className="px-6 mt-10 mb-24">
        <h2 className="text-[23px] font-semibold mb-3">이번 주 추천 장소</h2>

        {isLoading && (
          <div className="text-center text-gray-500 py-6">
            추천 여행지를 불러오는 중이에요...
          </div>
        )}

        {(topPlaces.length > 0
          ? topPlaces
          : [
            {
              id: 1,
              name: "EVERLAND",
              imageUrl: "/images/everland.jpg",
              rating: 4.0,
              reviewCount: 4321,
              tags: ["#놀이공원", "#야경"],
            },
          ]
        ).map((place, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 mb-4"
          >
            <img
              src={place.imageUrl ?? "/images/default.png"}
              alt={place.name}
              className="w-full h-[140px] object-cover"
            />

            <div className="p-4">
              <div className="flex justify-between items-start">
                <p className="text-[15px] font-semibold text-gray-800 mt-2">
                  {place.name}
                </p>
                <div
                  className="flex items-center gap-[4px] text-white text-[11px] font-medium px-[7px] py-[3px] rounded-md"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(255,112,112,0.95), rgba(255,150,150,0.9))",
                  }}
                >
                  <img
                    src="/images/star1.png"
                    alt="별"
                    className="w-[10px] h-[10px]"
                  />
                  <span>{place.rating?.toFixed(1) ?? "4.0"} / 5.0</span>
                </div>
              </div>

              <div className="flex justify-between items-end mt-2">
                <div className="flex items-center gap-1">
                  <img
                    src="/images/pencil.png"
                    alt="리뷰 아이콘"
                    className="w-[13px] h-[13px] opacity-80"
                  />
                  <span
                    className="font-bold text-[13px]"
                    style={{
                      color: "#AE7C7C",
                      fontFamily: "NanumSquareRound",
                    }}
                  >
                    리뷰 {place.reviewCount?.toLocaleString() ?? 0}개
                  </span>
                </div>

                <div className="flex flex-wrap justify-end gap-[6px]">
                  {((place.tags ?? ["#놀이공원", "#야경"]) as string[]).map(
                    (tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[12px] text-gray-600 font-medium"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 지도 모달 */}
      {isMapModalOpen && (
        <div
          onClick={() => setIsMapModalOpen(false)}
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-lg w-[90%] max-w-[360px] p-5 relative"
          >
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-3 left-3 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-[16px] font-semibold text-center mb-4">
              나의 경기지도
            </h3>
            <GyeonggiMap colors={mapColors} />
          </div>
        </div>
      )}

      {/* 사진 업로드 모달 */}
      {isUploadModalOpen && (
        <div
          onClick={() => setIsUploadModalOpen(false)}
          className="fixed inset-0 bg-black/40 flex justify-center items-end z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-[320px] mb-[100px] pb-3"
          >
            <div className="flex justify-between items-center px-5 py-3 border-b">
              <h3 className="text-[15px] font-semibold text-gray-800">
                사진 업로드
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col py-2">
              <button
                onClick={() => {
                  alert("카메라 실행 예정");
                  setIsUploadModalOpen(false);
                }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
              >
                <img
                  src="/images/Camera.png"
                  alt="camera"
                  className="w-6 h-6"
                />
                <span className="text-[15px] font-medium text-gray-800">
                  카메라
                </span>
              </button>

              <div className="border-t my-1" />

              <button
                onClick={() => {
                  alert("갤러리 업로드 예정");
                  setIsUploadModalOpen(false);
                }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
              >
                <img
                  src="/images/image.png"
                  alt="gallery"
                  className="w-6 h-6"
                />
                <span className="text-[15px] font-medium text-gray-800">
                  갤러리에서 업로드
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}