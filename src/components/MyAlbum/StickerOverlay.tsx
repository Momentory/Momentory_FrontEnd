import React, { useState, useEffect } from 'react';
import type { Sticker } from '../../types/Templates';

interface StickerOverlayProps {
  stickers?: Sticker[];
  onUpdateSticker?: (stickerId: string, updates: Partial<Sticker>) => void;
}

const StickerOverlay: React.FC<StickerOverlayProps> = ({ stickers, onUpdateSticker }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log('StickerOverlay 렌더링, 스티커 개수:', stickers?.length || 0);
    console.log('스티커 데이터:', stickers);
  }, [stickers]);

  const handleMouseDown = (e: React.MouseEvent, sticker: Sticker) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(sticker.id);
    setDragOffset({
      x: e.clientX - sticker.x,
      y: e.clientY - sticker.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingId) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    onUpdateSticker?.(draggingId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  useEffect(() => {
    if (draggingId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingId, dragOffset]);

  if (!stickers || stickers.length === 0) {
    console.log('스티커가 없어서 렌더링 안함');
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {stickers.map((sticker) => {
        console.log('스티커 렌더링:', sticker);
        return (
          <img
            key={sticker.id}
            src={sticker.imageUrl}
            alt={sticker.spotName || sticker.region}
            className="absolute object-contain cursor-move select-none pointer-events-auto"
            style={{
              left: `${sticker.x}px`,
              top: `${sticker.y}px`,
              width: `${sticker.width}px`,
              height: `${sticker.height}px`,
              opacity: draggingId === sticker.id ? 0.7 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, sticker)}
            draggable={false}
          />
        );
      })}
    </div>
  );
};

export default StickerOverlay;
