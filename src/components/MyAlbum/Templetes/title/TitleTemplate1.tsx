import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const TitleTemplate1: React.FC<TemplateProps> = ({ data, updateData, onEmptyAreaClick, onImageClick }) => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();

  const handleEmptyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onEmptyAreaClick) {
      onEmptyAreaClick({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col relative">
      <div className="h-1/2 flex flex-col justify-center p-4" onClick={handleEmptyClick}>
        <input
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-full text-3xl font-bold text-center bg-transparent outline-none"
          placeholder="제목을 입력하세요"
        />
        <div className="mt-2 w-full text-sm text-black text-right">
          {year}.{month}.{day}
        </div>
      </div>

      <div className="h-1/2 relative">
        {data.image && (
          <img
            src={data.image}
            alt="preview"
            className="w-full h-full object-cover"
          />
        )}
        <div
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${
            !data.image ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'
          }`}
          onClick={() => onImageClick?.('image')}
        >
          {!data.image && <PlusIcon className="w-9 h-9" />}
        </div>
      </div>
    </div>
  );
};

export default TitleTemplate1;
