import PointIcon from '../../assets/icons/pointIcon.svg?react';
import Bg from '../../assets/accessories/bgImg.svg';
import GemIcon from '../../assets/icons/gemIcon.svg?react';
import { getItemTransform, transformToCSS } from '../../config/itemPositions';

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

const CharacterDisplay = ({
  level,
  point,
  gem,
  equippedAccessories,
  accessories,
  characterImage,
  bottomSheetHeight = 100,
}: CharacterDisplayProps) => {
  return (
    <>
      <div className="fixed inset-0 max-w-[480px] mx-auto left-0 right-0 z-0">
        <img src={Bg} alt="background" className="w-full h-full object-cover" />
      </div>

      <div className="fixed top-[116px] left-0 right-0 max-w-[480px] mx-auto px-4 py-3 flex justify-between items-center z-[60] bg-black/15">
        <span className="text-lg font-bold text-black">Level {level}</span>
        <div className="flex items-center gap-2">
          <GemIcon className="w-6 h-6"/>
          <span className="text-lg font-bold text-black">{gem}</span>
          <PointIcon className="w-6 h-6" />
          <span className="text-lg font-bold text-black">{point}</span>
        </div>
      </div>

      <div
        className="fixed inset-0 flex items-end justify-center px-16 max-w-[480px] mx-auto left-0 right-0 z-10 transition-all duration-300"
        style={{ paddingBottom: `${bottomSheetHeight + 32}px` }}
      >
        <div className="relative w-full max-w-[300px] aspect-square">
          <img src={characterImage} alt="character" className="w-full h-full object-contain" />
          {equippedAccessories.map((id) => {
            const acc = accessories.find((a) => a.id === id);
            if (!acc || !acc.type) return null;

            const itemTransform = getItemTransform(id, acc.type.toUpperCase());
            const transformStyle = transformToCSS(itemTransform);

            return (
              <img
                key={id}
                src={acc.icon}
                alt={acc.name}
                style={{
                  transform: transformStyle,
                }}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CharacterDisplay;

