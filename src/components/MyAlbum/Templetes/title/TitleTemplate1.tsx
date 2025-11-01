import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const TitleTemplate1: React.FC<TemplateProps> = ({ data, updateData }) => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();

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

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col">
      <div className="h-1/2 flex flex-col justify-center p-4">
        <input
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
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
        <label
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${
            !data.image ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          {!data.image && <PlusIcon className="w-9 h-9" />}
        </label>
      </div>
    </div>
  );
};

export default TitleTemplate1;
