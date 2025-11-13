import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import CloseIcon from '../../assets/icons/closeIcon.svg?react';
import type { MapPhoto } from '../../types/map';
import {
  useMyRegionPhotos,
  usePublicRegionPhotos,
} from '../../hooks/map/useMap';

interface LocationState {
  isPublic?: boolean;
  regionName?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\.\s?/g, '.');
}

export default function RegionPhotosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPublic = false, regionName = '' } = (location.state ??
    {}) as LocationState;

  useEffect(() => {
    if (!regionName) {
      navigate(isPublic ? '/publicMap' : '/myMap', { replace: true });
    }
  }, [navigate, isPublic, regionName]);

  const {
    data: myRegionPhotos,
    isLoading: isLoadingMy,
    isError: isMyError,
  } = useMyRegionPhotos(!isPublic ? regionName || null : null);

  const {
    data: publicRegionPhotos,
    isLoading: isLoadingPublic,
    isError: isPublicError,
  } = usePublicRegionPhotos(isPublic ? regionName || null : null);

  const photos = useMemo(() => {
    const data = isPublic ? publicRegionPhotos : myRegionPhotos;
    return data ?? [];
  }, [isPublic, publicRegionPhotos, myRegionPhotos]);

  const isLoading = isPublic ? isLoadingPublic : isLoadingMy;
  const isError = isPublic ? isPublicError : isMyError;

  const mappedPhotos = useMemo(() => {
    return photos.map((photo: MapPhoto) => ({
      id: photo.photoId,
      url: photo.imageUrl,
      date: formatDate(photo.createdAt),
      description:
        photo.memo ||
        (isPublic
          ? '설명이 등록되지 않은 공개 사진입니다.'
          : '설명이 등록되지 않은 나의 사진입니다.'),
      location: photo.address || regionName || '경기도',
      author: isPublic ? '공개 사진' : '나의 사진',
    }));
  }, [photos, regionName, isPublic]);

  const headerTitle = regionName
    ? isPublic
      ? `공개 사진 · ${regionName}`
      : `나의 사진 · ${regionName}`
    : isPublic
      ? '공개 중인 전체 사진'
      : '내가 올린 전체 사진';

  return (
    <div className="flex h-screen max-w-[480px] flex-col overflow-hidden bg-white">
      <DropdownHeader
        title={headerTitle}
        leftIcon={<CloseIcon className="h-6 w-6" />}
        onLeftClick={() => navigate(isPublic ? '/publicMap' : '/myMap')}
      />

      <div className="flex-1 overflow-y-auto bg-[#F8F4F4] px-5 pb-24 pt-[116px]">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 bg-[#EDE2E2] px-5 py-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="aspect-119/234 animate-pulse bg-[#D9C9C9]"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[#A3A3A3]">
            <p className="text-base font-semibold">
              사진을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
            </p>
          </div>
        ) : mappedPhotos.length > 0 ? (
          <div className="bg-[#EDE2E2] px-5 py-6">
            <div className="grid grid-cols-2 gap-4">
              {mappedPhotos.map((photo, index) => (
                <button
                  key={photo.id ?? `${photo.url}-${index}`}
                  type="button"
                  onClick={() =>
                    navigate('/all-my-photos/viewer', {
                      state: {
                        photos,
                        startIndex: index,
                        isPublic,
                        regionName,
                      },
                    })
                  }
                  className="bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative aspect-119/234 w-full overflow-hidden border border-[#CC7272] bg-[#EDE2E2]">
                    <img
                      src={photo.url}
                      alt={`${photo.location} 사진`}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0RFRURFRCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7tj6zsiJjsubTrjbAg7JqU66OMPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>
                  <div className="mt-3 space-y-1 text-left">
                    <p className="text-sm font-semibold text-[#732727]">
                      {photo.date}
                    </p>
                    <p className="text-xs text-[#A17070] line-clamp-2">
                      {photo.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[#A3A3A3]">
            <p className="text-base font-semibold">
              {isPublic
                ? '이 지역에는 아직 공개된 사진이 없어요.'
                : '이 지역에는 아직 업로드한 사진이 없어요.'}
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

