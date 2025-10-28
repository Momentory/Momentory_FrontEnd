import type { TitleTemplateProps } from '../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../assets/icons/plusIcon.svg?react';

const TitleTemplate3 = ({ title, setTitle, image, setImage }: TitleTemplateProps) => {
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
    <div className="w-full aspect-[9/16] mx-auto font-[inter] flex flex-col justify-end p-8 gap-10">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-3xl font-bold bg-transparent outline-none"
        placeholder="제목을 입력하세요"
      />
      <div className="relative w-full max-w-[480px] aspect-3/4 bg-[#D8D8D8] overflow-hidden">
        {image && <img src={image} alt="preview" className="w-full h-full object-cover" />}
        <label className="group absolute inset-0 flex items-center justify-center text-sm text-white cursor-pointer transition-colors hover:bg-black/40">
          {!image && (<PlusIcon className="w-9 h-9"/>)}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
    </div>
  );
};

export default TitleTemplate3;