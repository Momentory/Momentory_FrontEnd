// 하단시트(드래그/토글) UI
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BottomSheet({
  height,
  setHeight,
  isExpanded,
  setIsExpanded,
  isPublic = false,
  regionName = '고양시',
}: {
  height: number;
  setHeight: (v: number) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  isPublic?: boolean;
  regionName?: string;
}) {
  const navigate = useNavigate();

  // 💡 [수정 1] 최대 높이를 516px로 변경
  const MAX_HEIGHT = 516;
  const MIN_HEIGHT = 100;

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;
    const startExpanded = isExpanded;

    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = startY - e.clientY;
      // 💡 [수정 2] 최대/최소 높이 변수 적용
      setHeight(
        Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + deltaY))
      );
    };

    const onUp = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = startY - e.clientY;

      if (deltaY > 30) {
        setHeight(MAX_HEIGHT); // 💡 [수정 3]
        setIsExpanded(true);
      } else if (deltaY < -30) {
        setHeight(MIN_HEIGHT); // 💡 [수정 4]
        setIsExpanded(false);
      } else {
        setHeight(startExpanded ? MAX_HEIGHT : MIN_HEIGHT); // 💡 [수정 5]
      }

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleClick = () => {
    if (isExpanded) {
      setHeight(MIN_HEIGHT); // 💡 [수정 6]
      setIsExpanded(false);
    } else {
      setHeight(MAX_HEIGHT); // 💡 [수정 7]
      setIsExpanded(true);
    }
  };

  const handlePhotoFrameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 지역별 사진 페이지로 이동
    navigate(`/region-photos/${encodeURIComponent(regionName)}`, {
      state: { isPublic },
    });
  };

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[450px] bg-white rounded-t-2xl shadow-lg z-30 transition-all duration-300 overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div
        className="w-20 h-1 bg-[#E2E2E2] rounded-full mx-auto mt-4 cursor-pointer"
        onMouseDown={handleDrag}
        onClick={handleClick}
      />

      {/* p-6에 pb-14 (56px) 추가된 상태 */}
      <div className="p-6 pb-14">
        <h2 className="text-[25px] font-bold mb-1">경기도 {regionName}</h2>
        <p className="text-sm text-[#A3A3A3] mb-8">최근 방문 2025-10-15</p>

        <h3 className="text-[18px] font-semibold mb-3">
          {isPublic ? '공개된 전체 사진' : '공개 중인 전체 사진'}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[106px] bg-[#EDE2E2] cursor-pointer"
              onClick={handlePhotoFrameClick}
            />
          ))}
          <div
            className="h-[106px] bg-[#C8B6B6] flex items-center justify-center text-lg text-white font-bold cursor-pointer"
            onClick={handlePhotoFrameClick}
          >
            +5
          </div>
        </div>
      </div>
    </div>
  );
}
