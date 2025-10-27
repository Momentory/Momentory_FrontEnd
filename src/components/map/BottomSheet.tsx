// 하단시트(드래그/토글) UI
import React from 'react';

export default function BottomSheet({
  height,
  setHeight,
  isExpanded,
  setIsExpanded,
}: {
  height: number;
  setHeight: (v: number) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
}) {
  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;
    const startExpanded = isExpanded;

    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = startY - e.clientY;
      setHeight(Math.max(100, Math.min(460, startHeight + deltaY)));
    };

    const onUp = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = startY - e.clientY;
      if (deltaY > 30) (setHeight(460), setIsExpanded(true));
      else if (deltaY < -30) (setHeight(100), setIsExpanded(false));
      else setHeight(startExpanded ? 460 : 100);

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleClick = () => {
    if (isExpanded) (setHeight(100), setIsExpanded(false));
    else (setHeight(460), setIsExpanded(true));
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
      <div className="p-6">
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
      </div>
    </div>
  );
}
