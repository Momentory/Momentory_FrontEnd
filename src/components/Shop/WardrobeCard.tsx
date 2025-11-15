import { useMemo } from 'react';
import type { Wardrobe } from '../../types/shop';
import { getItemTransform, transformToCSS } from '../../config/itemPositions';
import { useCharacterItems } from '../../hooks/shop/useCharacterItems';

interface WardrobeCardProps {
  wardrobe: Wardrobe;
  characterImage: string;
  characterType?: string;
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
  characterType,
  isSelected,
  onClick,
}: WardrobeCardProps) => {
  const showAsSelected = isSelected;

  const accessories = useMemo(() => {
    const items = [];
    if (wardrobe.clothing) {
      items.push({
        id: wardrobe.clothing.itemId,
        name: wardrobe.clothing.name,
        icon: wardrobe.clothing.imageUrl,
        locked: false,
        type: 'CLOTHING',
      });
    }
    if (wardrobe.expression) {
      items.push({
        id: wardrobe.expression.itemId,
        name: wardrobe.expression.name,
        icon: wardrobe.expression.imageUrl,
        locked: false,
        type: 'EXPRESSION',
      });
    }
    if (wardrobe.effect) {
      items.push({
        id: wardrobe.effect.itemId,
        name: wardrobe.effect.name,
        icon: wardrobe.effect.imageUrl,
        locked: false,
        type: 'EFFECT',
      });
    }
    if (wardrobe.decoration) {
      items.push({
        id: wardrobe.decoration.itemId,
        name: wardrobe.decoration.name,
        icon: wardrobe.decoration.imageUrl,
        locked: false,
        type: 'DECORATION',
      });
    }
    return items;
  }, [wardrobe]);

  const equippedAccessories = useMemo(() => {
    return accessories.map(acc => acc.id);
  }, [accessories]);

  const {
    clothingImageSrc,
    effectImageSrc,
    nofaceImageSrc,
    expressionImageSrc,
  } = useCharacterItems(accessories, equippedAccessories, characterType);

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
          {clothingImageSrc ? (
            <img
              src={clothingImageSrc}
              alt="character with clothing"
              className="w-full h-full object-contain"
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : nofaceImageSrc ? (
            <img
              src={nofaceImageSrc}
              alt="character noface"
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={characterImage}
              alt="character"
              className="w-full h-full object-contain"
            />
          )}
          {effectImageSrc && wardrobe.effect && (
            <img
              src={effectImageSrc}
              alt={wardrobe.effect.name}
              style={{
                transform: transformToCSS(getItemTransform(wardrobe.effect.itemId, 'EFFECT')),
              }}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}
          {expressionImageSrc && wardrobe.expression && (
            <img
              src={expressionImageSrc}
              alt={wardrobe.expression.name}
              style={{
                transform: transformToCSS(getItemTransform(wardrobe.expression.itemId, 'EXPRESSION')),
              }}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}
          {wardrobe.decoration && (
            <img
              src={wardrobe.decoration.imageUrl}
              alt={wardrobe.decoration.name}
              style={{
                transform: transformToCSS(getItemTransform(wardrobe.decoration.itemId, 'DECORATION')),
              }}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}
        </div>
      </button>
    </div>
  );
};

export default WardrobeCard;
