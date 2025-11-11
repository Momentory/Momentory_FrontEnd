import React from 'react';
import ChevronDown from '../../assets/icons/dropdown.svg?react';
import LockIcon from '../../assets/icons/lockIcon.svg?react';

export interface Accessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
}

export interface BottomSheetProps {
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  accessories: Accessory[];
  selectedCategory: string;
  equippedAccessories: number[];
  onAccessoryClick: (id: number) => void;
  onCategoryChange?: (category: string) => void;
}

export default function BottomSheet({
  height,
  setHeight,
  isExpanded,
  setIsExpanded,
  accessories,
  selectedCategory,
  equippedAccessories,
  onAccessoryClick,
  onCategoryChange,
}: BottomSheetProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [hasMoved, setHasMoved] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasMoved(false);
    const startY = e.clientY;
    const startHeight = height;

    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = Math.abs(startY - e.clientY);
      if (deltaY > 5) setHasMoved(true);

      const actualDeltaY = startY - e.clientY;
      const newHeight = Math.max(100, Math.min(460, startHeight + actualDeltaY));
      setHeight(newHeight);
    };

    const onUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const deltaY = startY - e.clientY;

      if (!hasMoved && Math.abs(deltaY) < 5) {
        setTimeout(() => {
          if (isExpanded) {
            setHeight(100);
            setIsExpanded(false);
          } else {
            setHeight(460);
            setIsExpanded(true);
          }
        }, 0);
      } else {
        if (deltaY > 50) {
          setHeight(460);
          setIsExpanded(true);
        } else if (deltaY < -50) {
          setHeight(100);
          setIsExpanded(false);
        } else {
          if (height > 280) {
            setHeight(460);
            setIsExpanded(true);
          } else {
            setHeight(100);
            setIsExpanded(false);
          }
        }
      }

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

const handleTouchStart = (e: React.TouchEvent) => {
  setIsDragging(true);
  setHasMoved(false);

  const startY = e.touches[0].clientY;
  const startHeight = height;

  const onMove = (e: TouchEvent) => {
    e.preventDefault();
    const deltaY = Math.abs(startY - e.touches[0].clientY);
    if (deltaY > 10) setHasMoved(true);
    const actualDeltaY = startY - e.touches[0].clientY;
    const newHeight = Math.max(100, Math.min(460, startHeight + actualDeltaY));
    setHeight(newHeight);
  };

  const onEnd = (e: TouchEvent) => {
    setIsDragging(false);

    const deltaY = startY - (e.changedTouches[0]?.clientY || startY);

    if (!hasMoved && Math.abs(deltaY) < 10) {
      setTimeout(() => {
        if (isExpanded) {
          setHeight(100);
          setIsExpanded(false);
        } else {
          setHeight(460);
          setIsExpanded(true);
        }
      }, 50);
    } else {
      if (deltaY > 50) {
        setHeight(460);
        setIsExpanded(true);
      } else if (deltaY < -50) {
        setHeight(100);
        setIsExpanded(false);
      } else {
        if (height > 280) {
          setHeight(460);
          setIsExpanded(true);
        } else {
          setHeight(100);
          setIsExpanded(false);
        }
      }
    }

    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
  };

  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
};


  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-2xl shadow-lg z-50 overflow-hidden"
      style={{
        height: `${height}px`,
        transition: isDragging ? 'none' : 'height 0.3s ease-out',
      }}
    >
      <div
        className="cursor-grab active:cursor-grabbing select-none py-4"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-20 h-1 bg-[#E2E2E2] rounded-full mx-auto" />
      </div>

      <div>
        <div className="flex justify-between items-center px-6 pb-4">
          <div className="relative">
            <button
              className="flex items-center gap-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <span className="text-2xl font-extrabold text-[#444444]">
                {selectedCategory}
              </span>
              <ChevronDown className={`w-3 h-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] border border-zinc-400 z-[40]"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
              <div className="flex flex-col px-2.5 py-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange?.('CLOTHING');
                    setIsDropdownOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="text-left text-[#727272] text-xs font-bold tracking-tight px-6 py-3"
                >
                  의상
                </button>
                <hr className="border-t border-stone-300" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange?.('EXPRESSION');
                    setIsDropdownOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                 className="text-left text-[#727272] text-xs font-bold tracking-tight px-6 py-3"
                >
                  표정
                </button>
                <hr className="border-t border-stone-300" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange?.('EFFECT');
                    setIsDropdownOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                 className="text-left text-[#727272] text-xs font-bold tracking-tight px-6 py-3"
                >
                  이펙트
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-[360px]">
          {accessories.map((accessory) => {
            const isEquipped = equippedAccessories.includes(accessory.id);
            return (
              <button
                key={accessory.id}
                onClick={() => onAccessoryClick(accessory.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  accessory.locked
                    ? 'bg-gray-100 border-2 border-gray-300 cursor-not-allowed'
                    : isEquipped
                    ? 'border-2 border-[#FF7070]'
                    : 'bg-white border-2 border-black'
                }`}
              >
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={accessory.icon}
                    alt={accessory.name}
                    className={`max-w-full max-h-full object-contain ${
                      accessory.locked ? 'opacity-40' : 'opacity-100'
                    }`}
                    style={{
                      transform: 'scale(0.5)',
                      transformOrigin: 'center',
                    }}
                  />
                  {accessory.locked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LockIcon/>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
