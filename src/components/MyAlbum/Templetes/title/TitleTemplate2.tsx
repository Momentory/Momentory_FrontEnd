import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const TitleTemplate2: React.FC<TemplateProps> = ({ data, updateData, onEmptyAreaClick, onImageClick }) => {
  const handleEmptyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onEmptyAreaClick) {
      onEmptyAreaClick({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  return (
    <div className="relative w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col justify-end p-6 overflow-hidden bg-[#D8D8D8]">
      {data.image && <img src={data.image} alt="background" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover z-0" />}
      <div
        className="absolute inset-0 z-5"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%)'
        }}
      />
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
        onClick={() => onImageClick?.('image')}
      >
        {!data.image && <PlusIcon className="w-10 h-10 text-gray-400" />}
      </div>
      <div className="relative z-20 border-l-4 border-white pl-4 mb-10" onClick={handleEmptyClick}>
        <div className="relative w-full mb-1">
          <input
            value={data.subTitle || ''}
            onChange={(e) => updateData({ subTitle: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-2xl text-white bg-transparent outline-none block"
          />
          {!data.subTitle && (
            <div className="absolute inset-0 text-2xl text-gray-300 pointer-events-none" data-html2canvas-ignore="true">
              소제목을 입력하세요
            </div>
          )}
        </div>
        <div className="relative w-full">
          <input
            value={data.title || ''}
            onChange={(e) => updateData({ title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-3xl font-bold text-white bg-transparent outline-none block"
          />
          {!data.title && (
            <div className="absolute inset-0 text-3xl font-bold text-gray-100 pointer-events-none" data-html2canvas-ignore="true">
              제목을 입력하세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleTemplate2;