import React from 'react';
import SelectIcon from '../../assets/accessories/select.svg?react';

interface CharacterSelectButtonProps {
  onSelectCharacter?: () => void;
}

const CharacterSelectButton: React.FC<CharacterSelectButtonProps> = ({
  onSelectCharacter,
}) => {
  if (!onSelectCharacter) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSelectCharacter();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="flex items-center justify-center w-10 h-10 cursor-pointer"
      aria-label="캐릭터 선택"
    >
      <SelectIcon className="w-full h-full" />
    </button>
  );
};

export default CharacterSelectButton;
