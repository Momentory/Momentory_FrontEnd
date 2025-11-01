import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const PageTemplate2: React.FC<TemplateProps> = ({ data, updateData }) => {
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
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col items-center justify-start bg-white pb-[30px] p-6">
      <div className="relative w-full aspect-[3/4] bg-[#D8D8D8] overflow-hidden">
        {data.image && <img src={data.image} alt="preview" className="w-full h-full object-cover" />}
        <label className="absolute inset-0 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/40">
          {!data.image && <PlusIcon className="w-9 h-9 text-gray-400" />}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="w-full max-w-[480px] px-10 mt-8 text-left">
        <textarea
          value={data.bodyText || ''}
          onChange={(e) => updateData({ bodyText: e.target.value })}
          className="w-full text-sm text-black bg-transparent outline-none resize-none leading-relaxed mb-5 placeholder:text-gray-400"
          placeholder="본문 내용을 입력하세요."
          rows={3}
        />
        <input
          value={data.subTitle || ''}
          onChange={(e) => updateData({ subTitle: e.target.value })}
          className="w-full text-sm text-black bg-transparent outline-none block mb-1 placeholder:text-gray-400"
          placeholder="소제목을 입력하세요"
        />
        <input
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          className="w-full text-sm font-bold text-black bg-transparent outline-none block placeholder:text-gray-700"
          placeholder="제목을 입력하세요"
        />
      </div>
    </div>
  );
};

export default PageTemplate2;