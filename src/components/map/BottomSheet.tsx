// 하단시트(드래그/토글) UI
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
  const MIN_HEIGHT = 40; // 슬라이드바가 살짝만 보이도록 조정
  const BOTTOM_BAR_HEIGHT = 70; // bottom navigation bar 높이

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

  const thumbnails = useMemo(() => {
    if (regionPhotos.length >= 6) {
      return regionPhotos.slice(0, 5);
    }
    return regionPhotos;
  }, [regionPhotos]);

  const remainingCount = Math.max(regionPhotos.length - 5, 0);
  const shouldShowViewAll = regionPhotos.length >= 6;

  const dragHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dragHandle = dragHandleRef.current;
    if (!dragHandle) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const startHeight = height;
      const startExpanded = isExpanded;

      const onMove = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        const deltaY = startY - clientY;
        setHeight(
          Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + deltaY))
        );
      };

      const onEnd = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        const clientY = 'changedTouches' in event ? event.changedTouches[0].clientY : (event as MouseEvent).clientY;
        const deltaY = startY - clientY;

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
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    };

    dragHandle.addEventListener('mousedown', handleStart);
    dragHandle.addEventListener('touchstart', handleStart, { passive: false });

    return () => {
      dragHandle.removeEventListener('mousedown', handleStart);
      dragHandle.removeEventListener('touchstart', handleStart);
    };
  }, [height, isExpanded, setHeight, setIsExpanded]);

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

      navigate('/all-my-photos', {
        state: {
          isPublic,
          regionName,
          initialPhotoIndex: index, // 선택된 사진 인덱스 전달
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

        {shouldShowViewAll && (
          <button
            type="button"
            className="flex h-[106px] items-center justify-center rounded-lg bg-[#C8B6B6] text-lg font-bold text-white transition hover:bg-[#b79f9f]"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateList();
            }}
          >
            +{remainingCount}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* 외부 클릭 감지용 오버레이 (bottom bar 제외) */}
      {isExpanded && (
        <div
          className="fixed top-0 left-0 right-0 z-[49] bg-black/20"
          style={{ bottom: '80px' }}
          onClick={() => {
            setHeight(MIN_HEIGHT);
            setIsExpanded(false);
          }}
        />
      )}
      <div
        className="fixed left-1/2 -translate-x-1/2 w-full max-w-[480px] overflow-hidden rounded-t-2xl bg-white shadow-lg transition-all duration-300 z-50"
        style={{ height: `${height}px`, bottom: `${BOTTOM_BAR_HEIGHT}px` }}
      >
        <div
          ref={dragHandleRef}
          className="mx-auto mt-4 h-1 w-20 cursor-pointer rounded-full bg-[#E2E2E2]"
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
              className="flex items-center hover:opacity-80 transition-opacity"
              style={{ color: '#C8B6B6' }}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateList();
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {renderContent()}
      </div>
      </div>
    </>
  );
}
