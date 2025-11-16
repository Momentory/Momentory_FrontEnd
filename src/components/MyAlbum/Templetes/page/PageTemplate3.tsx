import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';
import StickerOverlay from '../../StickerOverlay';

const PageTemplate3: React.FC<TemplateProps> = ({ data, updateData, onImageClick }) => {

  return (
    <div className="w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col relative">
      <div className="flex h-3/5">
        <div className="flex-1 bg-white" />
        <div className="flex-1 relative bg-gray-100 overflow-hidden">
          {data.image1 && <img src={data.image1} alt="Top Right" crossOrigin="anonymous" className="w-full h-full object-cover" />}
          <div 
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${!data.image1 ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'}`}
            onClick={() => onImageClick?.('image1')}
          >
            {!data.image1 && <PlusIcon className="w-10 h-10 text-gray-400" />}
          </div>
        </div>
      </div>
      <div className="flex h-2/5">
        <div className="flex-1 relative bg-gray-100 overflow-hidden">
          {data.image2 && <img src={data.image2} alt="Bottom Left" crossOrigin="anonymous" className="w-full h-full object-cover" />}
          <div 
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${!data.image2 ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'}`}
            onClick={() => onImageClick?.('image2')}
          >
            {!data.image2 && <PlusIcon className="w-10 h-10 text-gray-400" />}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center bg-white">
          <div className="relative w-full px-5 mb-1">
            <input
              value={data.subTitle2 || ''}
              onChange={(e) => updateData({ subTitle2: e.target.value })}
              className="w-full text-sm font-semibold bg-transparent outline-none"
            />
            {!data.subTitle2 && (
              <div className="absolute inset-0 px-5 text-sm font-semibold text-gray-400 pointer-events-none" data-html2canvas-ignore="true">
                Title
              </div>
            )}
          </div>
          <div className="relative w-full px-5">
            <textarea
              value={data.bodyText2 || ''}
              onChange={(e) => updateData({ bodyText2: e.target.value })}
              className="w-full text-sm text-black bg-transparent outline-none resize-none"
              rows={4}
            />
            {!data.bodyText2 && (
              <div className="absolute inset-0 px-5 text-sm text-gray-400 pointer-events-none" data-html2canvas-ignore="true">
                추가 텍스트
              </div>
            )}
          </div>
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

export default PageTemplate3;