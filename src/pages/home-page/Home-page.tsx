import { useEffect, useState } from "react";
import {
  getTopPlaces,
  getCharacterStatus,
  getEvents,
  getMyPoint,
  getMyMapInfo
} from "../../api/home";
import { getMyProfileSummary } from "../../api/mypage";
import { getPointHistory } from "../../api/character";
import { X } from "lucide-react";
import GyeonggiMap from './GyeonggiMap';
import CharacterSection from '../../components/Home/CharacterSection';
import EventSection from '../../components/Home/EventSection';
import CategorySection from '../../components/Home/CategorySection';
import TopPlacesSection from '../../components/Home/TopPlacesSection';
import Modal from '../../components/common/Modal';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
  const [userName, setUserName] = useState("");
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);

  const [isDropdownOpen, _setIsDropdownOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [_isError, setIsError] = useState(false);
  const [showPointHistoryModal, setShowPointHistoryModal] = useState(false);

  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const [mapColors, setMapColors] = useState<Record<string, string>>({});

  const { data: pointHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['pointHistory'],
    queryFn: getPointHistory,
    enabled: showPointHistoryModal,
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);

        const [
          places,
          charStatus,
          evts,
          pointData,
          mapData,
          profileSummary
        ] = await Promise.all([
          getTopPlaces(),
          getCharacterStatus(),
          getEvents(),
          getMyPoint(),
          getMyMapInfo(),
          getMyProfileSummary()
        ]);

        setTopPlaces(Array.isArray(places) ? places : []);

        if (profileSummary) {
          setUserName(profileSummary.nickname ?? "");
        }

        if (charStatus) {
          setLevel(charStatus.level ?? 0);
        }

        if (pointData) {
          setPoints(pointData.userPoint?.currentPoint ?? 0);
        }

        setEvents(Array.isArray(evts) ? evts : []);

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
    <div className="w-full min-h-screen bg-white overflow-y-auto overflow-x-hidden relative" style={{ paddingTop: 'calc(60px + env(safe-area-inset-top))' }}>
      <div className="w-full bg-white flex justify-between items-center px-6 py-2 border-b border-gray-200 flex-shrink-0" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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
          <button
            onClick={() => setShowPointHistoryModal(true)}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-[20px] h-[20px] bg-[#FFD966] rounded-full flex items-center justify-center text-[13px] font-bold text-white">
              P
            </div>
            <span className="text-gray-700 font-medium">{points}</span>
          </button>
        </div>
      </div>

      <CharacterSection userName={userName} />

      <EventSection events={events} isLoading={isLoading} />

      <CategorySection />

      <TopPlacesSection topPlaces={topPlaces} isLoading={isLoading} />

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

      {showPointHistoryModal && (
        <Modal
          title="포인트 내역"
          onClose={() => setShowPointHistoryModal(false)}
        >
          <div className="flex flex-col px-4 w-full max-h-[500px] overflow-y-auto">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center py-10">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            ) : pointHistory.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <div className="text-gray-500">포인트 내역이 없습니다</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pointHistory.map((history: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {history.actionDesc}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(history.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="ml-4">
                      <p
                        className={`text-base font-bold ${
                          history.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {history.amount > 0 ? '+' : ''}{history.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}