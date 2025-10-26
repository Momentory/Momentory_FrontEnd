// 확대 시 이미지 팝업

import React from 'react';

export default function MarkerPopup({
  marker,
  active,
  album,
  zoomed,
  zoomIn,
}: {
  marker: { id: number; top: string; left: string; image: string };
  active: boolean;
  album?: { id: number; imageUrl: string; title: string };
  zoomed: boolean;
  zoomIn: (marker: { id: number; top: string; left: string; image: string }) => void;
}) {
  const rightSide = parseFloat(marker.left) > 70;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top: marker.top, left: marker.left }}
    >
      {(!zoomed || active) && (
        <img
          src={marker.image}
          className="w-8 h-8 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            zoomIn(marker);
          }}
        />
      )}

      {zoomed && active && album && (
        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center"
          style={{
            left: rightSide ? 'calc(-112px)' : 'calc(100% + 12px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="absolute w-4 h-4 rounded-full bg-[#FF7070] z-20 -top-1 -left-1" />
            <img
              src={album.imageUrl}
              className="w-[100px] h-[62px] rounded-lg shadow-md cursor-pointer relative z-10 border-2 border-white"
              onClick={() => console.log(`${album.title} 클릭 → 앨범으로 이동`)}
            />
            <div className="mt-1 flex items-center gap-1">
              <span className="w-4 h-4 bg-[#732727] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {album.id}
              </span>
              <p className="text-sm font-bold whitespace-nowrap">나의 앨범 페이지로 이동</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
