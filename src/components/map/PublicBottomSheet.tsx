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

  const maxHeight = window.innerHeight * 0.9;

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
        Math.max(460, dragStart.height + deltaY),
        maxHeight
      );
      setHeight(newHeight);

      if (newHeight >= maxHeight - 50) {
        setIsExpanded(true);
      } else if (newHeight <= 460) {
        setIsExpanded(false);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);

      if (height >= maxHeight - 50) {
        setHeight(Math.floor(maxHeight));
        setIsExpanded(true);
      } else if (height > 460 + 100) {
        setHeight(Math.floor(maxHeight));
        setIsExpanded(true);
      } else {
        setHeight(460);
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
  }, [isDragging, dragStart, height, maxHeight, setHeight]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (height === 100) {
      // 초기 높이 → 460px
      setHeight(460);
      setIsExpanded(false);
    } else if (height === 460) {
      // 460px → 최대 높이
      setHeight(Math.floor(maxHeight));
      setIsExpanded(true);
    } else if (height >= maxHeight - 50) {
      // 최대 높이 → 초기 높이(100px)
      setHeight(100);
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (height === 460 && selectedMarkerId) {
        const target = e.target as HTMLElement;
        if (!bottomSheetRef.current?.contains(target)) {
          setHeight(100);
          setIsExpanded(false);
        }
      }
    };

    if (height === 460) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [height, selectedMarkerId, setHeight, setIsExpanded]);

  return (
    <div
      ref={bottomSheetRef}
      data-bottom-sheet
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[450px] bg-white rounded-t-2xl shadow-lg z-30 overflow-hidden ${
        !isDragging ? 'transition-all duration-300' : ''
      }`}
      style={{ height: `${height}px` }}
    >
      <div
        className="w-20 h-1 bg-[#E2E2E2] rounded-full mx-auto mt-4 cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={handleClick}
      />

      <div className="p-6">
        {selectedMarkerId ? (
          <>
            <h2 className="text-[25px] font-bold mb-1">경기도 고양시</h2>
            <p className="text-sm text-[#A3A3A3] mb-8">최근 방문 2025-10-15</p>

            <h3 className="text-[18px] font-semibold mb-3">나의 사진</h3>
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
                <h3 className="text-[18px] font-semibold mb-1">지역별 앨범</h3>
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
