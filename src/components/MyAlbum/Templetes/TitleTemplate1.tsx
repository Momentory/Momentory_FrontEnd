import type { TitleTemplateProps } from '../../../types/Templates';
import React from 'react';
import PlusIcon from '../../../assets/icons/plusIcon.svg?react';

const TitleTemplate1 = ({
  title,
  setTitle,
  image,
  setImage,
}: TitleTemplateProps) => {
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
    <div className="w-full max-w-[480px] aspect-[9/16] mx-auto font-[inter] flex flex-col">
      <div className="h-1/2 flex items-center justify-center p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold text-center bg-transparent outline-none"
          placeholder="제목을 입력하세요"
        />
      </div>
      <div className="h-1/2 relative">
        {image && (
          <img
            src={image}
            alt="preview"
            className="w-full h-full object-cover"
          />
        )}
        <label
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${
            !image ? 'bg-[#D8D8D8]' : 'bg-transparent hover:bg-black/30'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          {!image && <PlusIcon className="w-9 h-9" />}
        </label>
      </div>
    </div>
  );
};

export default TitleTemplate1;
