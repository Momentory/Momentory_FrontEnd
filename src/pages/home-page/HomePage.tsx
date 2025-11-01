import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopPlaces, getRecentPhotos, getMapPreview } from "../../api/home";
import { X } from "lucide-react";

interface Marker {
  id: number;
  name: string;
  top: number;
  left: number;
  color: string;
}

export default function HomePage() {
  const navigate = useNavigate();

  // 유저 기본 데이터
  const [userName, _setUserName] = useState("Username");
  const [level, _setLevel] = useState(35);
  const [points, _setPoints] = useState(1500);

  // 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // API 데이터
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [_recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [_mapPreview, setMapPreview] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const [places, photos, map] = await Promise.all([
          getTopPlaces(),
          getRecentPhotos(),
          getMapPreview(),
        ]);

        // undefined 방지 (응답 없으면 빈 배열로)
        setTopPlaces(Array.isArray(places) ? places : []);
        setRecentPhotos(Array.isArray(photos) ? photos : []);
        setMapPreview(map?.previewUrl ?? null);
        setMarkers(Array.isArray(map?.markers) ? map.markers : []);
      } catch (e) {
        console.error("홈 데이터 로드 실패:", e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);



  // if (isLoading)
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen text-gray-500">
  //       <img src="/images/loading.gif" alt="로딩중" className="w-[60px] mb-3" />
  //       데이터를 불러오는 중이에요...
  //     </div>
  //   );

  // if (isError)
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen text-gray-500">
  //       데이터를 불러오지 못했습니다.
  //     </div>
  //   );

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto relative mt-[60px]">
      {/* 상단바 */}
      <div className="w-full bg-white flex justify-between items-center px-6 py-2 border-b border-gray-200 sticky top-0 z-30">
        <p className="text-[14px] font-semibold text-gray-800">Level {level}</p>

        <div className="relative flex items-center gap-1 text-[14px]">
          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-[28px] bg-white border rounded-[10px] shadow-md py-2 w-[120px] z-40">
              <button
                onClick={() => {
                  alert("프로필 수정");
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                프로필 수정
              </button>
              <button
                onClick={() => {
                  alert("로그아웃");
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                로그아웃
              </button>
            </div>
          )}

          {/* 포인트 */}
          <div className="w-[20px] h-[20px] bg-[#FFD966] rounded-full flex items-center justify-center text-[13px] font-bold text-white">
            P
          </div>
          <span className="text-gray-700 font-medium">{points}</span>
        </div>
      </div>

      {/* 인사말 + 캐릭터 섹션 */}
      <div
        className="relative w-full h-[380px] flex flex-col justify-start items-start px-6 pt-6"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(141,204,255,0.7), rgba(254,255,234,0.7)), url("/images/bg.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-left z-10">
          <p className="text-[15px] text-black-800 mt+5">
            안녕하세요 <span className="font-semibold">{userName}</span>님
          </p>
          <p className="text-[14px] text-gray-700 mt-1">
            오늘은 어떤 사진을 찍어볼까요?
          </p>
        </div>
        <img
          src="/images/char1.png"
          alt="캐릭터"
          className="absolute left-1/2 -translate-x-1/4 z-1"
          style={{
            width: "380px",
            height: "430px",
            bottom: "-40px",
          }}
        />

        <img
          src="/images/ribon.png"
          alt="리본"
          className="absolute -translate-x-1/4 z-1"
          style={{
            width: "76px",
            height: "48px",
            bottom: "138px",
            left:"47%"
          }}
        />

        <img
          src="/images/ground.png"
          alt="ground"
          className="absolute bottom-0 left-0 w-full h-[100px] object-left object-cover z-0"
        />
      </div>

      {/* 진행중인 이벤트 */}
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
            { img: "/images/photo-gallery.png", label: "최근사진", link: "/album" },
            { img: "/images/star.png", label: "추천여행", link: "/travel" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition"
              onClick={item.onClick ?? (() => navigate(item.link ?? ""))}
            >
              <div className="w-[50px] h-[50px] bg-white/30 rounded-full flex items-center justify-center mb-1">
                <img src={item.img} alt={item.label} className="w-[32px] h-auto" />
              </div>
              <p className="text-[13px]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 추천 여행지 섹션 */}
      <section className="px-6 mt-10 mb-24">
        <h2 className="text-[17px] font-semibold mb-3">이번 주 추천 장소</h2>

        {isLoading && (
          <div className="text-center text-gray-500 py-6">
            추천 여행지를 불러오는 중이에요...
          </div>
        )}
        {isError && (
          <div className="text-center text-gray-500 py-6">
            {/* 데이터를 불러오지 못했습니다 */}
          </div>
        )}

        <div className="grid gap-5">
          {(topPlaces?.length > 0
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
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              {/* 여행지 이미지 */}
              <img
                src={place.imageUrl ?? "/images/default.png"}
                alt={place.name}
                className="w-full h-[140px] object-cover"
              />

              {/* 여행지 정보 */}
              <div className="p-4">
                {/* 이름 + 평점 */}
                <div className="flex justify-between items-start">
                  <p className="text-[15px] font-semibold text-gray-800 mt-2">
                    {place.name}
                  </p>

                  {/* 평점 박스 */}
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

                {/* 리뷰 + 태그 */}
                <div className="flex justify-between items-end mt-2">
                  {/* 왼쪽: 리뷰 */}
                  <div className="flex items-center gap-1">
                    <img
                      src="/images/pencil.png"
                      alt="리뷰 아이콘"
                      className="w-[13px] h-[13px] opacity-80"
                    />
                    <span
                      className="font-bold text-[13px]"
                      style={{ color: "#AE7C7C", fontFamily: "NanumSquareRound" }}
                    >
                      리뷰 {place.reviewCount?.toLocaleString() ?? 0}개
                    </span>
                  </div>

                  {/* 오른쪽: 태그 */}
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
        </div>
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
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-3 left-3 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="text-[16px] font-semibold text-center mb-4">
              나의 경기지도
            </h3>

            {/* 지도 프리뷰 + 마커 표시 */}
            <div className="relative flex justify-center">
              <img
                src="/images/map-preview.png"
                alt="경기도 지도"
                className="w-[220px] h-auto rounded-md"
              />

              {markers.map((m) => (
                <div
                  key={m.id}
                  className="absolute w-4 h-4 rounded-full border-2 border-white"
                  style={{
                    top: `${m.top}%`,
                    left: `${m.left}%`,
                    backgroundColor: m.color,
                    transform: "translate(-50%, -50%)",
                    zIndex: 20,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 업로드 모달 */}
      {isUploadModalOpen && (
        <div
          onClick={() => setIsUploadModalOpen(false)}
          className="fixed inset-0 bg-black/40 flex justify-center items-end z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-[320px] mb-[100px] pb-3 animate-[slideUp_0.25s_ease-out]"
          >
            <div className="flex justify-between items-center px-5 py-3 border-b">
              <h3 className="text-[15px] font-semibold text-gray-800">사진 업로드</h3>
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
                <img src="/images/Camera.png" alt="camera" className="w-6 h-6" />
                <span className="text-[15px] font-medium text-gray-800">카메라</span>
              </button>

              <div className="border-t my-1" />

              <button
                onClick={() => {
                  alert("갤러리 업로드 예정");
                  setIsUploadModalOpen(false);
                }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
              >
                <img src="/images/image.png" alt="gallery" className="w-6 h-6" />
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
