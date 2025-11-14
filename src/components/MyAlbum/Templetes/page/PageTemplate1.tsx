import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const PageTemplate1: React.FC<TemplateProps> = ({ data, updateData, onEmptyAreaClick, onImageClick }) => {
  const handleEmptyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onEmptyAreaClick) {
      onEmptyAreaClick({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col p-6 bg-white">
      <div className="flex justify-between items-start h-[35%] mb-[40px]">
        <div className="w-[30%] h-full relative bg-gray-100 overflow-hidden">
          {data.image1 && <img src={data.image1} alt="Image 1" crossOrigin="anonymous" className="w-full h-full object-cover" />}
          <div 
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${!data.image1 ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'}`}
            onClick={() => onImageClick?.('image1')}
          >
            {!data.image1 && <PlusIcon className="w-8 h-8 text-gray-400" />}
          </div>
        </div>

        <div className="w-[30%] h-full relative bg-gray-100 overflow-hidden mt-[40px]">
          {data.image2 && <img src={data.image2} alt="Image 2" crossOrigin="anonymous" className="w-full h-full object-cover" />}
          <div 
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${!data.image2 ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'}`}
            onClick={() => onImageClick?.('image2')}
          >
            {!data.image2 && <PlusIcon className="w-8 h-8 text-gray-400" />}
          </div>
        </div>

        <div className="w-[30%] h-full relative bg-gray-100 overflow-hidden">
          {data.image3 && <img src={data.image3} alt="Image 3" crossOrigin="anonymous" className="w-full h-full object-cover" />}
          <div 
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${!data.image3 ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'}`}
            onClick={() => onImageClick?.('image3')}
          >
            {!data.image3 && <PlusIcon className="w-8 h-8 text-gray-400" />}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-10 px-6 text-center" onClick={handleEmptyClick}>
        <input
          value={data.subTitle || ''}
          onChange={(e) => updateData({ subTitle: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[80%] text-3xl font-normal text-black bg-transparent outline-none block text-left placeholder:text-gray-400"
          placeholder="SMALL TITLE"
        />
        <input
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[80%] text-3xl font-bold bg-transparent outline-none block text-left placeholder:text-gray-700"
          placeholder="MAIN TITLE"
        />
      </div>

      <div className="flex-1 overflow-y-auto mt-[40px] flex justify-end" onClick={handleEmptyClick}>
        <textarea
          value={data.bodyText || ''}
          onChange={(e) => updateData({ bodyText: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[60%] text-sm text-black bg-transparent outline-none resize-none placeholder:text-gray-400 font-normal leading-relaxed text-right"
          placeholder="본문 내용을 입력하세요."
        />
      </div>
    </div>
  );
};

export default PageTemplate1;