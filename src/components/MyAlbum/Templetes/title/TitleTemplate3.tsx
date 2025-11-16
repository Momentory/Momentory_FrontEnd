import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';
import StickerOverlay from '../../StickerOverlay';

const TitleTemplate3: React.FC<TemplateProps> = ({ data, updateData, onEmptyAreaClick, onImageClick }) => {
  const handleEmptyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onEmptyAreaClick) {
      onEmptyAreaClick({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col bg-white p-8 gap-10 relative">
      <div className="py-8 pb-4 mt-10" onClick={handleEmptyClick}>
        <div className="relative w-full">
          <input
            value={data.title || ''}
            onChange={(e) => updateData({ title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-3xl font-bold bg-transparent outline-none"
          />
          {!data.title && (
            <div className="absolute inset-0 text-3xl font-bold text-gray-400 pointer-events-none" data-html2canvas-ignore="true">
              제목을 입력하세요
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 relative mb-8">
        {data.image && <img src={data.image} alt="preview" crossOrigin="anonymous" className="w-full h-full object-cover" />}
        <div
          className={`absolute inset-0 flex items-center justify-center text-sm text-white cursor-pointer transition-colors ${!data.image ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/40'}`}
          onClick={() => onImageClick?.('image')}
        >
          {!data.image && <PlusIcon className="w-9 h-9 text-gray-400" />}
        </div>
      </div>
      <StickerOverlay
        stickers={data.stickers}
        onUpdateSticker={(stickerId, updates) => {
          const updatedStickers = data.stickers?.map(s =>
            s.id === stickerId ? { ...s, ...updates } : s
          );
          updateData({ stickers: updatedStickers });
        }}
      />
    </div>
  );
};

export default TitleTemplate3;