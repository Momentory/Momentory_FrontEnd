import PointIcon from '../../assets/icons/pointIcon.svg?react';
import Bg from '../../assets/accessories/bgImg.svg';
import Character from '../../assets/accessories/character.svg';
import GemIcon from '../../assets/icons/gemIcon.svg?react'

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
}

const CharacterDisplay = ({
  level,
  gem,
  point,
  equippedAccessories,
  accessories,
}: CharacterDisplayProps) => {
  return (
    <div className="relative flex-1 h-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={Bg} alt="background" className="w-full h-full object-cover" />
      </div>

      <div className="absolute px-4 pt-3 pb-2 left-0 right-0 flex justify-between items-center z-10 bg-black/15">
        <span className="text-lg font-bold text-black">Level {level}</span>
        <div className="flex items-center gap-1">
          <GemIcon className="w-6 h-6"/>
          <span className="text-lg font-bold text-black">{gem}</span>
          <PointIcon className="w-6 h-6" />
          <span className="text-lg font-bold text-black">{point}</span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <img src={Character} alt="character" className="w-full h-full object-contain" />
          {equippedAccessories.map((id) => {
            const acc = accessories.find((a) => a.id === id);
            if (!acc) return null;
            return (
              <img
                key={id}
                src={acc.icon}
                alt={acc.name}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CharacterDisplay;

