import type { Wardrobe } from '../../types/shop';

interface WardrobeCardProps {
  wardrobe: Wardrobe;
  characterImage: string;
  isSelected: boolean;
  isCurrent?: boolean;
  onClick: () => void;
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const WardrobeCard = ({
  wardrobe,
  characterImage,
  isSelected,
  onClick,
}: WardrobeCardProps) => {
  const showAsSelected = isSelected;

  return (
    <div className="relative">
      <div
        className={`absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center z-10
          ${showAsSelected ? 'border-[#ff7070] bg-[#ff7070]' : 'border-[#8B8B8B] bg-white'}
        `}
      >
        {showAsSelected && <CheckIcon />}
      </div>

      <button
        onClick={onClick}
        className={`relative w-full overflow-hidden rounded-xl border bg-white pt-15 px-2 pb-5 shadow-sm transition aspect-square
          ${showAsSelected ? 'border-2 border-[#ff7070]' : 'border-[#8B8B8B]'}
        `}
      >
        <div className="relative w-full h-full">
          <img
            src={characterImage}
            alt="character"
            className="w-full h-full object-contain"
          />
          {wardrobe.clothing && (
            <img
              src={wardrobe.clothing.imageUrl}
              alt={wardrobe.clothing.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
          {wardrobe.expression && (
            <img
              src={wardrobe.expression.imageUrl}
              alt={wardrobe.expression.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
          {wardrobe.effect && (
            <img
              src={wardrobe.effect.imageUrl}
              alt={wardrobe.effect.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
          {wardrobe.decoration && (
            <img
              src={wardrobe.decoration.imageUrl}
              alt={wardrobe.decoration.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
        </div>
      </button>
    </div>
  );
};

export default WardrobeCard;
