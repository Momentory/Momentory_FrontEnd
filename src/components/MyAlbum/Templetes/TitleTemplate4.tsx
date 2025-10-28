import type { TitleTemplateProps } from '../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../assets/icons/plusIcon.svg?react';

const TitleTemplate4 = ({
  title,
  setTitle,
  subTitle,
  setSubTitle,
  image,
  setImage,
}: TitleTemplateProps) => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !setImage) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex">
      <div className="w-1/2 relative bg-[#D8D8D8]">
        {image && <img src={image} alt="preview" className="w-full h-full object-cover" />}
        <label className="group absolute inset-0 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/40">
        {!image && (<PlusIcon className="w-9 h-9"/>)}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      <div className="flex-1 flex flex-col justify-between p-6">
        <div className="text-right text-2xl font-semibold text-black">
          {month}
          <br />
          {day}
        </div>

        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent outline-none mb-25"
            placeholder="제목"
          />
          <textarea
            value={subTitle || ''}
            onChange={(e) => setSubTitle && setSubTitle(e.target.value)}
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