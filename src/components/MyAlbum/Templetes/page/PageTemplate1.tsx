import type { TemplateProps } from '../../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../../assets/icons/plusIcon.svg?react';

const PageTemplate1: React.FC<TemplateProps> = ({ data, updateData }) => {
  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: 'image1' | 'image2' | 'image3',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateData({ [imageKey]: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col p-6 bg-white">
      {/* 이미지 섹션 */}
      <div className="flex justify-between items-start h-[35%] mb-[40px]">
        {/* 이미지 1 */}
        <div className="w-[30%] h-full relative bg-gray-100 overflow-hidden">
          {data.image1 && <img src={data.image1} alt="Image 1" className="w-full h-full object-contain" />}
          <label className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${!data.image1 ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'}`}>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              // handleUpload에 업데이트할 키('image1')를 전달합니다.
              onChange={(e) => handleUpload(e, 'image1')}
            />
            {!data.image1 && <PlusIcon className="w-8 h-8 text-gray-400" />}
          </label>
        </div>

        {/* 이미지 2 */}
        <div className="w-[30%] h-full relative bg-gray-100 overflow-hidden mt-[40px]">
          {data.image2 && <img src={data.image2} alt="Image 2" className="w-full h-full object-contain" />}
          <label className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${!data.image2 ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'}`}>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e, 'image2')}
            />
            {!data.image2 && <PlusIcon className="w-8 h-8 text-gray-400" />}
          </label>
        </div>

        {/* 이미지 3 */}
        <div className="w-[30%] h-full relative bg-gray-100 overflow-hidden">
          {data.image3 && <img src={data.image3} alt="Image 3" className="w-full h-full object-contain" />}
          <label className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${!data.image3 ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'}`}>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e, 'image3')}
            />
            {!data.image3 && <PlusIcon className="w-8 h-8 text-gray-400" />}
          </label>
        </div>
      </div>

      {/* 텍스트 입력 섹션 */}
      <div className="flex flex-col items-center mt-10 px-6 text-center">
        <input
          value={data.subTitle || ''}
          // updateData를 호출하여 subTitle 필드를 업데이트합니다.
          onChange={(e) => updateData({ subTitle: e.target.value })}
          className="w-full max-w-[80%] text-3xl font-normal text-black bg-transparent outline-none block text-left placeholder:text-gray-400"
          placeholder="SMALL TITLE"
        />
        <input
          value={data.title || ''}
          // updateData를 호출하여 title 필드를 업데이트합니다.
          onChange={(e) => updateData({ title: e.target.value })}
          className="w-full max-w-[80%] text-3xl font-bold bg-transparent outline-none block text-left placeholder:text-gray-700"
          placeholder="MAIN TITLE"
        />
      </div>

      {/* 본문 텍스트 영역 */}
      <div className="flex-1 overflow-y-auto mt-[40px] flex justify-end">
        <textarea
          value={data.bodyText || ''}
          // updateData를 호출하여 bodyText 필드를 업데이트합니다.
          onChange={(e) => updateData({ bodyText: e.target.value })}
          className="w-full max-w-[60%] text-sm text-black bg-transparent outline-none resize-none placeholder:text-gray-400 font-normal leading-relaxed text-right"
          placeholder="본문 내용을 입력하세요."
        />
      </div>
    </div>
  );
};

export default PageTemplate1;