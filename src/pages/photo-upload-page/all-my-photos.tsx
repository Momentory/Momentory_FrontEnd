import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import CloseIcon from '../../assets/icons/closeIcon.svg?react';
import {
  getMyMapLatestPhotos,
  getMyRegionPhotos,
  getPublicMapLatestPhotos,
  getPublicRegionPhotos,
} from '../../api/map';
import type { MapPhoto } from '../../types/map';

export default function RegionPhotosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPublic = location.state?.isPublic || false;

  const [photos, setPhotos] = useState<MapPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchAllPhotos = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // 1. 모든 지역의 최신 사진 맵 가져오기 (지역 목록 확인용)
        console.log(
          `[all-my-photos] ${isPublic ? '공개' : '내'} 사진 가져오기 시작`
        );
        const regionPhotoMap = isPublic
          ? await getPublicMapLatestPhotos()
          : await getMyMapLatestPhotos();

        console.log('[all-my-photos] 지역 목록:', Object.keys(regionPhotoMap));

        // 2. 각 지역의 모든 사진 가져오기
        const regionNames = Object.keys(regionPhotoMap);
        if (regionNames.length === 0) {
          console.log('[all-my-photos] 지역이 없음');
          setPhotos([]);
          setIsLoading(false);
          return;
        }

        const allPhotosPromises = regionNames.map((regionName) =>
          isPublic
            ? getPublicRegionPhotos(regionName)
            : getMyRegionPhotos(regionName)
        );

        const allPhotosArrays = await Promise.all(allPhotosPromises);
        const allPhotos = allPhotosArrays.flat();

        console.log(
          `[all-my-photos] 총 ${allPhotos.length}개의 ${isPublic ? '공개' : '내'} 사진 가져옴`
        );

        // 최신순으로 정렬 (createdAt 기준)
        const sortedPhotos = allPhotos.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        console.log(
          '[all-my-photos] 정렬 완료, 최종 사진 수:',
          sortedPhotos.length
        );
        if (sortedPhotos.length > 0) {
          console.log('[all-my-photos] 첫 번째 사진:', sortedPhotos[0]);
        }

        setPhotos(sortedPhotos);
      } catch (error) {
        console.error('[all-my-photos] 사진 목록 가져오기 실패:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPhotos();
  }, [isPublic]);

  const headerTitle = isPublic ? '공개 중인 전체 사진' : '내가 올린 전체 사진';

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-white overflow-hidden">
      <DropdownHeader
        title={headerTitle}
        leftIcon={<CloseIcon className="w-6 h-6" />}
        onLeftClick={() => navigate(isPublic ? '/publicMap' : '/myMap')}
      />

      <div className="flex-1 overflow-y-auto bg-[#F8F4F4] px-5 pb-24 pt-[116px]">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[#A3A3A3]">
            <p className="text-base font-semibold">사진을 불러오는 중...</p>
          </div>
        ) : isError ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[#A3A3A3]">
            <p className="text-base font-semibold">
              사진을 불러오는 중 오류가 발생했습니다.
            </p>
          </div>
        ) : photos.length > 0 ? (
          <div className="bg-[#EDE2E2] px-5 py-6 min-h-[calc(100vh-112px-80px)]">
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.photoId}
                  type="button"
                  onClick={() =>
                    navigate('/all-my-photos/viewer', {
                      state: { photos, startIndex: index, isPublic },
                    })
                  }
                  className="bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,0.05)]"
                >
                  <div
                    className="relative w-full overflow-hidden border border-[#CC7272] bg-[#EDE2E2]"
                    style={{ aspectRatio: '119/234' }}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={`전체 사진 ${photo.photoId}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0VERTJFMkUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mHPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[#A3A3A3]">
            <p className="text-base font-semibold">
              {isPublic
                ? '아직 공개된 사진이 없어요.'
                : '아직 업로드한 사진이 없어요.'}
            </p>
            {!isPublic && (
              <button
                type="button"
                onClick={() => navigate('/upload')}
                className="mt-6 rounded-xl bg-[#FF7070] px-6 py-3 text-white shadow-md transition hover:shadow-lg"
              >
                사진 업로드하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
