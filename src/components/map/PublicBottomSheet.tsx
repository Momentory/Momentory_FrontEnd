/**
 * @deprecated
 * 현재 사용되지 않음 (BottomSheet.tsx로 통합됨)
 * 추후 전체 지도에 지역별 앨범 기능이 다시 필요할 경우를 대비해 보관
 *
 * 사용 이력:
 * - 이전: PublicMapPage에서 지역별 앨범 표시용으로 사용
 * - 현재: BottomSheet.tsx 사용 (내 지도와 동일)
 */

import { useState, useEffect, useRef } from 'react';
import leftMap from '../../assets/left-map.svg';
import rightMap from '../../assets/right-map.svg';

interface Props {
  height: number;
  setHeight: (v: number) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  selectedMarkerId: number | null;
}

export default function PublicBottomSheet({
  height,
  setHeight,
  isExpanded,
  setIsExpanded,
  selectedMarkerId,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ y: 0, height: 0 });
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  const totalHeaderHeight = 112;
  const topGap = 20;
  const maxHeight = window.innerHeight - totalHeaderHeight - topGap;

  const midHeight = 516;

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart({ y: clientY, height });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = dragStart.y - clientY;

      const newHeight = Math.min(
        Math.max(midHeight, dragStart.height + deltaY),
        maxHeight
      );
      setHeight(newHeight);

      if (newHeight >= maxHeight - 50) {
        setIsExpanded(true);
      } else if (newHeight <= midHeight) {
        setIsExpanded(false);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);

      if (height >= maxHeight - 50) {
        setHeight(Math.floor(maxHeight));
        setIsExpanded(true);
      } else if (height > midHeight + 100) {
        setHeight(Math.floor(maxHeight));
        setIsExpanded(true);
      } else {
        setHeight(midHeight);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [
    isDragging,
    dragStart,
    height,
    maxHeight,
    midHeight,
    setHeight,
    setIsExpanded,
  ]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (height === 100) {
      setHeight(midHeight);
      setIsExpanded(false);
    } else if (height === midHeight) {
      setHeight(Math.floor(maxHeight));
      setIsExpanded(true);
    } else if (height >= maxHeight - 50) {
      setHeight(100);
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (height === midHeight && selectedMarkerId) {
        const target = e.target as HTMLElement;
        if (!bottomSheetRef.current?.contains(target)) {
          setHeight(100);
          setIsExpanded(false);
        }
      }
    };

    if (height === midHeight) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [height, midHeight, selectedMarkerId, setHeight, setIsExpanded]);

  return (
    <div
      ref={bottomSheetRef}
      data-bottom-sheet
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-white rounded-t-2xl shadow-lg z-30 overflow-hidden ${
        isExpanded ? 'flex flex-col' : ''
      } ${!isDragging ? 'transition-all duration-300' : ''}`}
      style={{ height: `${height}px` }}
    >
      <div
        className="w-20 h-1 bg-[#E2E2E2] rounded-full mx-auto mt-4 cursor-pointer flex-shrink-0"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={handleClick}
      />

      <div
        className={`p-6 pb-14 ${
          isExpanded ? 'flex-1 overflow-y-auto' : 'overflow-y-hidden'
        }`}
      >
        {selectedMarkerId ? (
          <>
            <h2 className="text-[25px] font-bold mb-1">경기도 고양시</h2>
            <p className="text-sm text-[#A3A3A3] mb-8">최근 방문 2025-10-15</p>

            <h3 className="text-[18px] font-semibold mb-3">
              공개 중인 전체 사진
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-[106px] bg-[#EDE2E2]" />
              ))}
              <div className="h-[106px] bg-[#C8B6B6] flex items-center justify-center text-lg text-white font-bold">
                +5
              </div>
            </div>

            {isExpanded && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[18px] font-semibold">지역별 앨범</h3>
                  <button
                    onClick={() => console.log('지역별 앨범 버튼 클릭')}
                    className="w-8 h-8 flex items-center justify-center bg-transparent border-none outline-none"
                  >
                    <svg
                      width="8"
                      height="14"
                      viewBox="0 0 8 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      className="transform rotate+90"
                    >
                      <rect
                        y="14"
                        width="14"
                        height="8"
                        transform="rotate(-90 0 14)"
                        fill="url(#pattern0_367_600)"
                        fillOpacity="0.3"
                      />
                      <defs>
                        <pattern
                          id="pattern0_367_600"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_367_600"
                            transform="matrix(0.0025 0 0 0.00414286 -0.5 -1.08571)"
                          />
                        </pattern>
                        <image
                          id="image0_367_600"
                          width="800"
                          height="800"
                          preserveAspectRatio="none"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-[#A3A3A3] mb-4">
                  현재 1,000명 같이 참여 중...
                </p>

                <div className="bg-[#C8B6B6] shadow-lg p-4 mx-auto">
                  <div className="flex gap-4 h-full">
                    <div className="flex-1 h-full">
                      <img
                        src={leftMap}
                        alt="고양시 앨범 - 왼쪽 페이지"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 h-full">
                      <img
                        src={rightMap}
                        alt="고양시 앨범 - 오른쪽 페이지"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-[#A3A3A3]">
              마커를 클릭하여 지역 정보를 확인하세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
