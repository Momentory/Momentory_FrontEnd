import PointIcon from '../../assets/icons/pointIcon.svg?react';
import GemIcon from '../../assets/icons/gemIcon.svg?react';

interface CharacterInfoProps {
  level: number;
  point: number;
  gem: number;
}

const CharacterInfo = ({ level, point, gem }: CharacterInfoProps) => {
  return (
    <div className="fixed top-[116px] left-0 right-0 max-w-[480px] mx-auto px-4 py-3 flex justify-between items-center z-[60] bg-black/50">
      <span className="text-lg font-bold text-white">Level {level}</span>
      <div className="flex items-center gap-2">
        <GemIcon className="w-6 h-6"/>
        <span className="text-lg font-bold text-white">{gem}</span>
        <PointIcon className="w-6 h-6" />
        <span className="text-lg font-bold text-white">{point}</span>
      </div>
    </div>
  );
};

export default CharacterInfo;
