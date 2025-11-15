import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const PageTemplate2: React.FC<TemplateProps> = ({ data, updateData, onEmptyAreaClick, onImageClick }) => {
  const handleEmptyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onEmptyAreaClick) {
      onEmptyAreaClick({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col items-center justify-start bg-white pb-[30px] p-6">
      <div className="relative w-full aspect-[3/4] bg-[#D8D8D8] overflow-hidden">
        {data.image && <img src={data.image} alt="preview" crossOrigin="anonymous" className="w-full h-full object-cover" />}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/40"
          onClick={() => onImageClick?.('image')}
        >
          {!data.image && <PlusIcon className="w-9 h-9 text-gray-400" />}
        </div>
      </div>

      <div className="w-full max-w-[480px] px-10 mt-8 text-left" onClick={handleEmptyClick}>
        <textarea
          value={data.bodyText || ''}
          onChange={(e) => updateData({ bodyText: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-full text-sm text-black bg-transparent outline-none resize-none leading-relaxed mb-5 placeholder:text-gray-400"
          placeholder="본문 내용을 입력하세요."
          rows={3}
        />
        <input
          value={data.subTitle || ''}
          onChange={(e) => updateData({ subTitle: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-full text-sm text-black bg-transparent outline-none block mb-1 placeholder:text-gray-400"
          placeholder="소제목을 입력하세요"
        />
        <input
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-full text-sm font-bold text-black bg-transparent outline-none block placeholder:text-gray-700"
          placeholder="제목을 입력하세요"
        />
      </div>
    </div>
  );
};

export default PageTemplate2;