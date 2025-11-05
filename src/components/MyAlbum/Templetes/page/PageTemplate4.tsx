import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const PageTemplate4: React.FC<TemplateProps> = ({ data, updateData, onImageClick }) => {

  return (
    <div className="relative w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col justify-end p-6 overflow-hidden bg-[#D8D8D8]">
      {data.image && <img src={data.image} alt="background" className="absolute inset-0 w-full h-full object-cover z-0" />}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-transparent from-50% to-black/80" />
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
        onClick={() => onImageClick?.('image')}
      >
        {!data.image && <PlusIcon className="w-10 h-10 text-gray-400" />}
      </div>
      <div className="relative z-20 border-l-4 border-white pl-4 mb-10">
        <input
          value={data.subTitle || ''}
          onChange={(e) => updateData({ subTitle: e.target.value })}
          className="w-full text-2xl text-white bg-transparent outline-none block mb-1 placeholder:text-gray-300"
          placeholder="소제목을 입력하세요"
        />
        <input
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          className="w-full text-3xl font-bold text-white bg-transparent outline-none block placeholder:text-gray-100"
          placeholder="제목을 입력하세요"
        />
      </div>
    </div>
  );
};

export default PageTemplate4;