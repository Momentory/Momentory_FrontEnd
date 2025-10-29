import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const TitleTemplate4: React.FC<TemplateProps> = ({ data, updateData }) => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

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
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex bg-white">
      <div className="w-1/2 relative bg-[#D8D8D8]">
        {data.image && <img src={data.image} alt="preview" className="w-full h-full object-cover" />}
        <label className="group absolute inset-0 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/40">
          {!data.image && <PlusIcon className="w-9 h-9 text-gray-400" />}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      <div className="w-1/2 flex flex-col justify-between p-6">
        <div className="text-right text-2xl font-semibold text-black">
          {month}
          <br />
          {day}
        </div>
        <div>
          <input
            value={data.title || ''}
            onChange={(e) => updateData({ title: e.target.value })}
            className="w-full text-3xl font-bold bg-transparent outline-none mb-4"
            placeholder="제목"
          />
          <textarea
            value={data.subTitle || ''}
            onChange={(e) => updateData({ subTitle: e.target.value })}
            className="w-full text-sm font-medium text-black bg-transparent outline-none resize-none"
            placeholder="간단한 문구를 입력하세요"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default TitleTemplate4;