import React from 'react';

interface ClosetItemCardProps {
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ClosetItemCard: React.FC<ClosetItemCardProps> = ({
  imageUrl,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-xl border-2 bg-white p-4 pt-10 shadow-sm transition
        ${isSelected ? 'border-[#FF7070]' : 'border-[#8B8B8B]'}
      `}
    >
      {isSelected && (
        <div className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff7070] text-white">
          <CheckIcon />
        </div>
      )}

      <img
        src={imageUrl}
        alt="Closet item"
        className="aspect-square w-full object-contain"
      />
    </button>
  );
};

export default ClosetItemCard;
