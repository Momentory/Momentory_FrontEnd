import React, { useRef, useEffect } from 'react';
import StarIcon from '../../assets/icons/star2Icon.svg';

interface PopoverProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSelect: (option: 'memo' | 'template') => void;
}

const Popover: React.FC<PopoverProps> = ({ position, onClose, onSelect }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white rounded-2xl shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#B4B4B4] py-2 min-w-[160px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, calc(-100% - 12px))',
      }}
    >
      <div
        className="absolute top-full left-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"
        style={{
          transform: 'translateX(-50%)',
        }}
      />
      <button
        onClick={() => {
          onSelect('template');
          onClose();
        }}
        className="flex flex-row gap-2 w-full px-4 py-2.5 text-left text-xs transition-colors text-[#727272] font-bold items-center"
      >
        <div className="w-3 h-3 rounded-sm border border-[#8D8D8D]"/>
        페이지 템플릿 수정
      </button>
      <hr className="mx-3 text-[#C7C7C7]"/>
      <button
        onClick={() => {
          onSelect('memo');
          onClose();
        }}
        className="flex flex-row gap-2 w-full px-4 py-2.5 text-left text-xs transition-colors text-[#727272] font-bold items-center"
      >
        <img src={StarIcon}/>
        스티커 추가
      </button>
    </div>
  );
};

export default Popover;
