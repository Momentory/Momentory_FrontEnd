import { forwardRef } from 'react';
import Bg from '../../assets/accessories/bgImg.svg';
import { useCharacterItems } from '../../hooks/shop/useCharacterItems';
import CharacterInfo from './CharacterInfo';
import CharacterItems from './CharacterItems';

interface Accessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
}

interface CharacterDisplayProps {
  level: number;
  point: number;
  gem: number;
  equippedAccessories: number[];
  accessories: Accessory[];
  characterImage: string;
  characterType?: string;
  bottomSheetHeight?: number;
}

const CharacterDisplay = forwardRef<HTMLDivElement, CharacterDisplayProps>(({
  level,
  point,
  gem,
  equippedAccessories,
  accessories,
  characterImage,
  characterType,
  bottomSheetHeight = 100,
}, ref) => {
  const {
    clothingImageSrc,
    effectImageSrc,
    nofaceImageSrc,
    expressionImageSrc,
    effectAccessory,
    expressionAccessory,
  } = useCharacterItems(accessories, equippedAccessories, characterType);

  return (
    <>
      <div className="fixed inset-0 max-w-[480px] mx-auto left-0 right-0 z-0">
        <img src={Bg} alt="background" className="w-full h-full object-cover" />
      </div>

      <CharacterInfo level={level} point={point} gem={gem} />

      <div
        ref={ref}
        className="fixed top-[116px] bottom-0 left-0 right-0 max-w-[480px] mx-auto z-10 transition-all duration-300 overflow-hidden bg-white"
        style={{
          bottom: `${bottomSheetHeight}px`,
        }}
      >
        <div className="absolute inset-0 bg-white">
          <img src={Bg} alt="background" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute inset-0 flex items-end justify-center px-16"
          style={{ paddingBottom: '32px' }}
        >
          <div className="relative w-full max-w-[300px] aspect-square">
            {/* 의상 있으면 clothing 이미지, 표정 있으면 noface 이미지, 없으면 기본 캐릭터 */}
            {clothingImageSrc ? (
              <img
                src={clothingImageSrc}
                alt="character with clothing"
                className="w-full h-full object-contain"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : nofaceImageSrc ? (
              <img src={nofaceImageSrc} alt="character noface" className="w-full h-full object-contain" />
            ) : (
              <img src={characterImage} alt="character" className="w-full h-full object-contain" />
            )}

            <CharacterItems
              effectImageSrc={effectImageSrc}
              effectAccessory={effectAccessory}
              expressionImageSrc={expressionImageSrc}
              expressionAccessory={expressionAccessory}
              equippedAccessories={equippedAccessories}
              accessories={accessories}
            />
          </div>
        </div>
      </div>
    </>
  );
});

CharacterDisplay.displayName = 'CharacterDisplay';

export default CharacterDisplay;

