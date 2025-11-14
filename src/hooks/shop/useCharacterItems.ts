import { useMemo } from 'react';
import { clothingNameMap, effectNameMap, expressionNameMap } from '../../config/itemNameMap';

const clothingImages = import.meta.glob('/src/assets/clothing/**/*.png', { eager: true, as: 'url' });
const effectImages = import.meta.glob('/src/assets/effect/**/*.png', { eager: true, as: 'url' });
const expressionImages = import.meta.glob('/src/assets/expression/**/*.{png,svg}', { eager: true, as: 'url' });

interface Accessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
}

export const useCharacterItems = (
  accessories: Accessory[],
  equippedAccessories: number[],
  characterType?: string
) => {
  const clothingAccessory = useMemo(() => {
    return accessories.find(acc => acc.type.toUpperCase() === 'CLOTHING' && equippedAccessories.includes(acc.id));
  }, [accessories, equippedAccessories]);

  const effectAccessory = useMemo(() => {
    return accessories.find(acc => acc.type.toUpperCase() === 'EFFECT' && equippedAccessories.includes(acc.id));
  }, [accessories, equippedAccessories]);

  const expressionAccessory = useMemo(() => {
    return accessories.find(acc => acc.type.toUpperCase() === 'EXPRESSION' && equippedAccessories.includes(acc.id));
  }, [accessories, equippedAccessories]);

  const clothingImageSrc = useMemo(() => {
    if (!clothingAccessory || !characterType) return null;

    const type = characterType.toLowerCase();
    const itemName = clothingAccessory.name;
    const mappedName = clothingNameMap[itemName];
    if (!mappedName) {
      console.warn(`매핑되지 않은 의상: ${itemName}`);
      return null;
    }

    const characterSuffix = type === 'cat' ? '고양이' : '강아지';
    const fileName = `${mappedName}${characterSuffix}.png`;
    const searchPath = `/src/assets/clothing/${type}/${fileName}`;

    const imagePath = Object.keys(clothingImages).find(path => path === searchPath);

    return imagePath ? clothingImages[imagePath] as string : null;
  }, [clothingAccessory, characterType]);

  const effectImageSrc = useMemo(() => {
    if (!effectAccessory) return null;

    const itemName = effectAccessory.name;
    const mappedName = effectNameMap[itemName];
    if (!mappedName) {
      console.warn(`매핑되지 않은 이펙트: ${itemName}`);
      return null;
    }

    const searchPath = `/src/assets/effect/${mappedName}.png`;
    const imagePath = Object.keys(effectImages).find(path => path === searchPath);

    return imagePath ? effectImages[imagePath] as string : null;
  }, [effectAccessory]);

  const nofaceImageSrc = useMemo(() => {
    if (!expressionAccessory || !characterType) return null;

    const type = characterType.toLowerCase();
    const fileName = `noface-${type}.svg`;
    const searchPath = `/src/assets/expression/${fileName}`;

    const imagePath = Object.keys(expressionImages).find(path => path === searchPath);

    return imagePath ? expressionImages[imagePath] as string : null;
  }, [expressionAccessory, characterType]);

  const expressionImageSrc = useMemo(() => {
    if (!expressionAccessory || !characterType) return null;

    const type = characterType.toLowerCase();
    const itemName = expressionAccessory.name;
    const mappedName = expressionNameMap[itemName];
    if (!mappedName) {
      console.warn(`매핑되지 않은 표정: ${itemName}`);
      return null;
    }

    const searchPath = `/src/assets/expression/${type}/${mappedName}.png`;
    const imagePath = Object.keys(expressionImages).find(path => path === searchPath);

    return imagePath ? expressionImages[imagePath] as string : null;
  }, [expressionAccessory, characterType]);

  return {
    clothingAccessory,
    effectAccessory,
    expressionAccessory,
    clothingImageSrc,
    effectImageSrc,
    nofaceImageSrc,
    expressionImageSrc,
  };
};
