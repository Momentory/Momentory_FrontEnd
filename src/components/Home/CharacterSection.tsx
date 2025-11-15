import { useMemo } from 'react';
import { useCurrentCharacter } from '../../hooks/shop/useShopQueries';
import { useCharacterItems } from '../../hooks/shop/useCharacterItems';
import { getItemTransform, transformToCSS } from '../../config/itemPositions';
import CatImage from '../../assets/accessories/cat.svg';
import DogImage from '../../assets/accessories/dog.svg';

interface CharacterSectionProps {
  userName: string;
}

const CharacterSection = ({ userName }: CharacterSectionProps) => {
  const { data: currentCharacter } = useCurrentCharacter();

  const characterImage = useMemo(() => {
    if (!currentCharacter) return CatImage;
    return currentCharacter.characterType === 'CAT' ? CatImage : DogImage;
  }, [currentCharacter]);

  const allEquippedAccessories = useMemo(() => {
    if (!currentCharacter) return [];
    const equipped = currentCharacter.equipped;
    const equippedItems = [];

    if (equipped.clothing) {
      equippedItems.push({
        id: equipped.clothing.itemId,
        name: equipped.clothing.name,
        icon: equipped.clothing.imageUrl,
        locked: false,
        type: 'CLOTHING',
      });
    }
    if (equipped.expression) {
      equippedItems.push({
        id: equipped.expression.itemId,
        name: equipped.expression.name,
        icon: equipped.expression.imageUrl,
        locked: false,
        type: 'EXPRESSION',
      });
    }
    if (equipped.effect) {
      equippedItems.push({
        id: equipped.effect.itemId,
        name: equipped.effect.name,
        icon: equipped.effect.imageUrl,
        locked: false,
        type: 'EFFECT',
      });
    }
    if (equipped.decoration) {
      equippedItems.push({
        id: equipped.decoration.itemId,
        name: equipped.decoration.name,
        icon: equipped.decoration.imageUrl,
        locked: false,
        type: 'DECORATION',
      });
    }

    return equippedItems;
  }, [currentCharacter]);

  const equippedAccessories = useMemo(() => {
    return allEquippedAccessories.map(item => item.id);
  }, [allEquippedAccessories]);

  const {
    clothingImageSrc,
    effectImageSrc,
    nofaceImageSrc,
    expressionImageSrc,
  } = useCharacterItems(allEquippedAccessories, equippedAccessories, currentCharacter?.characterType);

  return (
    <div
      className="relative w-full h-[380px] flex flex-col justify-start items-start px-6 pt-6"
      style={{
        backgroundImage: "url('/images/bgImage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-[86px] bg-black/35 z-[2] flex flex-col justify-center px-[20px]">
        <p className="text-[15px] text-white font-medium">
          안녕하세요 <span className="font-bold">{userName}</span>님
        </p>
        <p className="text-[14px] text-white mt-1 opacity-90">
          오늘은 어떤 사진을 찍어볼까요?
        </p>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 z-1" style={{ width: "250px", height: "280px", top: "86px" }}>
        <div className="relative w-full h-full">
          {clothingImageSrc ? (
            <img
              src={clothingImageSrc}
              alt="character with clothing"
              style={{ transform: 'scaleX(-1)' }}
              className="w-full h-full object-contain"
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
              alt="캐릭터"
              className="w-full h-full object-contain"
            />
          )}

          {effectImageSrc && currentCharacter?.equipped.effect && (
            <img
              src={effectImageSrc}
              alt="effect"
              style={{
                transform: transformToCSS(getItemTransform(currentCharacter.equipped.effect.itemId, 'EFFECT')),
              }}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}

          {expressionImageSrc && currentCharacter?.equipped.expression && (
            <img
              src={expressionImageSrc}
              alt="expression"
              style={{
                transform: transformToCSS(getItemTransform(currentCharacter.equipped.expression.itemId, 'EXPRESSION')),
              }}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}

          {currentCharacter?.equipped.decoration && (
            <img
              src={currentCharacter.equipped.decoration.imageUrl}
              alt={currentCharacter.equipped.decoration.name}
              style={{
                transform: transformToCSS(getItemTransform(currentCharacter.equipped.decoration.itemId, 'DECORATION')),
              }}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterSection;
