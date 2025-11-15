import React from 'react';
import SelectIcon from '../../assets/accessories/select.svg?react';

interface CharacterSelectButtonProps {
  onSelectCharacter?: (characterType: 'CAT' | 'DOG') => void;
}

const CharacterSelectButton: React.FC<CharacterSelectButtonProps> = ({
  onSelectCharacter,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const characters = [
    { type: 'DOG' as const, label: '강아지' },
    { type: 'CAT' as const, label: '고양이' },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside as any);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, [isOpen]);

  const handleSelect = (characterType: 'CAT' | 'DOG') => {
    onSelectCharacter?.(characterType);
    setIsOpen(false);
  };

  if (!onSelectCharacter) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="flex items-center justify-center w-10 h-10 cursor-pointer"
        aria-label="캐릭터 선택"
      >
        <SelectIcon className="w-full h-full" />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-32 bg-white rounded-2xl shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] border border-zinc-400 z-[40]"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col px-2.5 py-1.5">
            {characters.map((character, index) => (
              <React.Fragment key={character.type}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(character.type);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="text-left text-[#727272] text-xs font-bold tracking-tight px-6 py-3"
                >
                  {character.label}
                </button>
                {index < characters.length - 1 && (
                  <hr className="border-t border-stone-300" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelectButton;
