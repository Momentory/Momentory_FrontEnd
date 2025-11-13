// 하단시트(드래그/토글) UI
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MapPhoto } from '../../types/map';
import {
  useMyRegionPhotos,
  usePublicRegionPhotos,
} from '../../hooks/map/useMap';

interface BottomSheetProps {
  height: number;
  setHeight: (v: number) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  isPublic?: boolean;
  regionName?: string;
  recentPhoto?: MapPhoto | null;
}

export default function BottomSheet({
  height,
  setHeight,
  isExpanded,
  setIsExpanded,
  isPublic = false,
  regionName = '',
  recentPhoto = null,
}: BottomSheetProps) {
  const navigate = useNavigate();

  const MAX_HEIGHT = 516;
  const MIN_HEIGHT = 100;

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

  const regionPhotos = useMemo(() => {
    const data = isPublic ? publicRegionPhotos : myRegionPhotos;
    return data ?? [];
  }, [isPublic, publicRegionPhotos, myRegionPhotos]);

  const isLoading = isPublic ? isLoadingPublic : isLoadingMy;
  const isError = isPublic ? isPublicError : isMyError;

  const formattedDate = useMemo(() => {
    const source = recentPhoto ?? regionPhotos[0];
    if (!source?.createdAt) return null;
    const date = new Date(source.createdAt);
    if (Number.isNaN(date.getTime())) return null;

    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\.\s?/g, '.');
  }, [recentPhoto, regionPhotos]);

  const thumbnails = useMemo(() => regionPhotos.slice(0, 5), [regionPhotos]);
  const remainingCount = Math.max(regionPhotos.length - thumbnails.length, 0);

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;
    const startExpanded = isExpanded;

    const onMove = (event: MouseEvent) => {
      event.preventDefault();
      const deltaY = startY - event.clientY;
      setHeight(
        Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + deltaY))
      );
    };

    const onUp = (event: MouseEvent) => {
      event.preventDefault();
      const deltaY = startY - event.clientY;

      if (deltaY > 30) {
        setHeight(MAX_HEIGHT);
        setIsExpanded(true);
      } else if (deltaY < -30) {
        setHeight(MIN_HEIGHT);
        setIsExpanded(false);
      } else {
        setHeight(startExpanded ? MAX_HEIGHT : MIN_HEIGHT);
      }

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleClick = () => {
    if (isExpanded) {
      setHeight(MIN_HEIGHT);
      setIsExpanded(false);
    } else {
      setHeight(MAX_HEIGHT);
      setIsExpanded(true);
    }
  };

  const handleNavigateList = useCallback(() => {
    if (!regionName) return;
    navigate('/all-my-photos', {
      state: { isPublic, regionName },
    });
  }, [navigate, isPublic, regionName]);

  const handlePhotoClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      if (!regionName || regionPhotos.length === 0) return;
      navigate('/all-my-photos/viewer', {
        state: {
          isPublic,
          regionName,
          photos: regionPhotos,
          startIndex: index,
        },
      });
    },
    [navigate, isPublic, regionName, regionPhotos]
  );

  const renderContent = () => {
    if (!regionName) {
      return (
        <div className="flex h-[180px] items-center justify-center text-sm text-[#A3A3A3]">
          지도의 마커를 선택해 지역 사진을 확인해보세요.
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={`loading-${idx}`}
              className="h-[106px] animate-pulse rounded-lg bg-[#F1E5E5]"
            />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex h-[180px] items-center justify-center text-sm text-[#A3A3A3]">
          사진 정보를 불러오지 못했어요.
        </div>
      );
    }

    if (regionPhotos.length === 0) {
      return (
        <div className="flex h-[180px] items-center justify-center text-sm text-[#A3A3A3]">
          {isPublic
            ? '아직 공개된 사진이 없어요.'
            : '이 지역에 업로드한 사진이 없어요.'}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2">
        {thumbnails.map((photo, index) => (
          <button
            key={photo.photoId ?? `${photo.imageUrl}-${index}`}
            type="button"
            className="group relative h-[106px] overflow-hidden rounded-lg bg-[#EDE2E2]"
            onClick={(e) => handlePhotoClick(e, index)}
          >
            <img
              src={photo.imageUrl}
              alt={photo.address || `${regionName} 사진`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA2IiBoZWlnaHQ9IjEwNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTA2IiBoZWlnaHQ9IjEwNiIgZmlsbD0iI0VERUQyRSIvPjxwYXRoIGQ9Ik0zNC4zMzMgNTEuNjY3QzM2Ljk0NiA0OS4wNTVINDIuNjY3VjQzLjMzM0gzNC4zMzNWNTEuNjY3Wk03NC42NjcgNTEuNjY3SDY4Ljk0N1Y0My4zMzNINzQuNjY3VjUxLjY2N1pNNDEuNSA2OC4zMzNIMzQuMzMzVjYyLjYxM0g0MS41VjY4LjMzM1pNNzEuODMzIDY4LjMzM0g2NC42NjdWNzQuMDU0SDcxLjgzM1Y2OC4zMzNaIiBmaWxsPSIjQ0NDIi8+PHBhdGggZD0iTTUxIDE4QzMyLjY2NyAxOCAxOCAzMi42NjcgMTggNTFTMzIuNjY3IDg4IDUxIDg4QzcwLjYxIDg4IDg0IDcwLjYxIDg0IDUxQzg0IDMyLjY2NyA3MC42MSAxOCA1MSAxOFpNNTQgNTAuOTk5QzU0LjgzNyA1MS40OTIgNTUuMzMzIDUyLjM1NSA1NS4zMzMgNTMuMzMzVjc2QzU1LjMzMyA3Ny4xMDcgNTQuNDQxIDc4IDUzLjMzMyA3OEg0OC42NjZDNDUuOTM3IDc4IDQzLjk5OSA3NS42NDEgNDMuOTk5IDcyLjg2NlY0Ny4zMzNIMjYuNjY3QzI1LjU2IDQ3LjMzMyAyNC42NjcgNDYuNDM5IDI0LjY2NyA0NS4zMzNWNDAuNjY3QzI0LjY2NyAzOS41NTkgMjUuNTYgMzguNjY3IDI2LjY2NyAzOC42NjdINDEuOTk5QzQyLjgzNyAzOC4xNzUgNDMuMzMzIDM3LjMxMiA0My4zMzMgMzYuNDMzVjI3LjEzMkM0My4zMzMgMjQuNzY0IDQ1Ljc2NiAyMy4zNSA0OC4yOTMgMjQuNTk3TDY3LjI5MyAzMy42NjZDODAuNSA0MC4zMzMgNzcuNSA1OC4xNjYgNjIuNSA2MC40ODhWNDQuNjY3SDc1LjMzM0M3Ni40NCA0NC42NjcgNzcuMzMzIDQ1LjU2IDc3LjMzMyA0Ni42NjdWMjguNjY3Qzc3LjMzMyAyNS45MzggNzQuNjk4IDI0LjAxMyA3Mi4wMDEgMjUuMTMxTDUzLjAwMSAzMy4wMDNDNTEuOTggMzMuNDg5IDUxLjM0NSAzNC41MTYgNTEuMzM0IDM1LjY3NFY0NC4zMzNDNTEuMzM0IDQ1LjQ0MSA1Mi4yMjcgNDYuMzM0IDUzLjMzNCA0Ni4zMzRBMS41IDAgMCAxIDU1IDQ3LjgzNFY0OS42NjZDNSU0Ljk0NyA1MS43NCA1NC43MzggNTIuMzYgNTMuNTMzIDUyLjYzN0w1NCA1MC45OTlaIiBmaWxsPSIjQ0NDIi8+PC9zdmc+';
              }}
            />
          </button>
        ))}

        <button
          type="button"
          className="flex h-[106px] items-center justify-center rounded-lg bg-[#C8B6B6] text-lg font-bold text-white transition hover:bg-[#b79f9f]"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigateList();
          }}
        >
          {remainingCount > 0 ? `+${remainingCount}` : '전체 보기'}
        </button>
      </div>
    );
  };

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[450px] overflow-hidden rounded-t-2xl bg-white shadow-lg transition-all duration-300"
      style={{ height: `${height}px` }}
    >
      <div
        className="mx-auto mt-4 h-1 w-20 cursor-pointer rounded-full bg-[#E2E2E2]"
        onMouseDown={handleDrag}
        onClick={handleClick}
      />

      <div className="p-6 pb-14">
        <h2 className="mb-1 text-[25px] font-bold">
          {regionName ? `경기도 ${regionName}` : '지역을 선택해주세요'}
        </h2>
        <p className="mb-8 text-sm text-[#A3A3A3]">
          {formattedDate
            ? `최근 방문 ${formattedDate}`
            : '최근 방문 기록이 없어요.'}
        </p>

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold">
            {isPublic ? '공개된 전체 사진' : '나의 사진'}
          </h3>
          {regionPhotos.length > 0 && (
            <button
              type="button"
              className="text-sm font-medium text-[#FF7070] underline-offset-4 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateList();
              }}
            >
              모두 보기
            </button>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
