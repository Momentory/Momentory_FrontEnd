import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const TitleTemplate4: React.FC<TemplateProps> = ({ data, updateData, onEmptyAreaClick, onImageClick }) => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const handleEmptyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onEmptyAreaClick) {
      onEmptyAreaClick({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex bg-white">
      <div className="w-1/2 relative bg-[#D8D8D8]">
        {data.image && <img src={data.image} alt="preview" crossOrigin="anonymous" className="w-full h-full object-cover" />}
        <div 
          className="group absolute inset-0 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/40"
          onClick={() => onImageClick?.('image')}
        >
          {!data.image && <PlusIcon className="w-9 h-9 text-gray-400" />}
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-between p-6" onClick={handleEmptyClick}>
        <div className="text-right text-2xl font-semibold text-black">
          {month}
          <br />
          {day}
        </div>
        <div>
          <div className="relative w-full mb-4">
            <input
              value={data.title || ''}
              onChange={(e) => updateData({ title: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-3xl font-bold bg-transparent outline-none"
            />
            {!data.title && (
              <div className="absolute inset-0 text-3xl font-bold text-gray-400 pointer-events-none" data-html2canvas-ignore="true">
                제목
              </div>
            )}
          </div>
          <div className="relative w-full">
            <textarea
              value={data.subTitle || ''}
              onChange={(e) => updateData({ subTitle: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-sm font-medium text-black bg-transparent outline-none resize-none"
              rows={4}
            />
            {!data.subTitle && (
              <div className="absolute inset-0 text-sm font-medium text-gray-400 pointer-events-none" data-html2canvas-ignore="true">
                간단한 문구를 입력하세요
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleTemplate4;