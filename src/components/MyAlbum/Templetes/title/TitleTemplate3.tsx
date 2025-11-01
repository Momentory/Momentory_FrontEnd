import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const TitleTemplate3: React.FC<TemplateProps> = ({ data, updateData, onEmptyAreaClick }) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateData({ image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEmptyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onEmptyAreaClick) {
      onEmptyAreaClick({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col justify-end p-8 gap-10 bg-white">
      <div onClick={handleEmptyClick}>
        <input
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-full text-3xl font-bold bg-transparent outline-none"
          placeholder="제목을 입력하세요"
        />
      </div>
      <div className="relative w-full aspect-3/4 bg-[#D8D8D8] overflow-hidden">
        {data.image && <img src={data.image} alt="preview" className="w-full h-full object-cover" />}
        <label className="group absolute inset-0 flex items-center justify-center text-sm text-white cursor-pointer transition-colors hover:bg-black/40">
          {!data.image && <PlusIcon className="w-9 h-9 text-gray-400" />}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
    </div>
  );
};

export default TitleTemplate3;