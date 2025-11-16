import React from 'react';
import LockIcon from '../../assets/icons/lockIcon.svg?react';
import RemoveIcon from '../../assets/accessories/remove.svg?react';
import CategoryDropdown from './CategoryDropdown';
import CharacterSelectButton from './CharacterSelectButton';

export interface Accessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
  unlockLevel?: number;
  unavailable?: boolean;
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
  onSelectCharacter?: () => void;
  onRemoveAll?: () => void;
  isLoading?: boolean;
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
  onSelectCharacter,
  onRemoveAll,
  isLoading = false,
}: BottomSheetProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [hasMoved, setHasMoved] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState<{ top: number; left: number } | null>(null);

  React.useEffect(() => {
    if (hoveredItem !== null) {
      const timer = setTimeout(() => {
        setHoveredItem(null);
        setTooltipPosition(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hoveredItem]);

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
      const newHeight = Math.max(100, Math.min(400, startHeight + actualDeltaY));
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
            setHeight(350);
            setIsExpanded(true);
          }
        }, 0);
      } else {
        if (deltaY > 50) {
          setHeight(350);
          setIsExpanded(true);
        } else if (deltaY < -50) {
          setHeight(100);
          setIsExpanded(false);
        } else {
          if (height > 225) {
            setHeight(350);
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
      const newHeight = Math.max(100, Math.min(500, startHeight + actualDeltaY));
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
            setHeight(500);
            setIsExpanded(true);
          }
        }, 50);
      } else {
        if (deltaY > 50) {
          setHeight(500);
          setIsExpanded(true);
        } else if (deltaY < -50) {
          setHeight(100);
          setIsExpanded(false);
        } else {
          if (height > 300) {
            setHeight(500);
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
    <>
      {hoveredItem && tooltipPosition && (
        <div
          className="fixed px-4 py-3 bg-white text-sm rounded-2xl shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-[#838383] whitespace-nowrap z-[9999] max-w-[90%]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-bold text-base mb-1 text-black">
            {accessories.find(a => a.id === hoveredItem)?.name}
          </div>
          {accessories.find(a => a.id === hoveredItem)?.unavailable ? (
            <div className="text-gray-600 text-xs">
              현재 캐릭터는 착용할 수 없어요
            </div>
          ) : accessories.find(a => a.id === hoveredItem)?.unlockLevel && (
            <div className="text-gray-600 text-xs">
              Lv.{accessories.find(a => a.id === hoveredItem)?.unlockLevel} 일 때 획득할 수 있어요
            </div>
          )}
        </div>
      )}

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-2xl shadow-lg z-[500] overflow-hidden"
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
            <CategoryDropdown
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />

            <div className="flex items-center gap-2">
              <CharacterSelectButton onSelectCharacter={onSelectCharacter} />
              {onRemoveAll && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAll();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-10 h-10 cursor-pointer"
                  aria-label="모든 아이템 벗기"
                >
                  <RemoveIcon className="w-full h-full" />
                </button>
              )}
            </div>
          </div>
        </div>

      <div
        className="px-6 pb-6 overflow-y-auto"
        style={{
          maxHeight: `${height - 120}px`
        }}
      >
        {isLoading ? (
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square w-full bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {accessories.map((accessory) => {
              const isEquipped = equippedAccessories.includes(accessory.id);
              return (
                <div
                  key={accessory.id}
                  className="relative"
                >
                  <button
                    onClick={(e) => {
                      if (accessory.locked || accessory.unavailable) {
                        if (hoveredItem === accessory.id) {
                          setHoveredItem(null);
                          setTooltipPosition(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPosition({
                            top: rect.bottom + 8,
                            left: rect.left + rect.width / 2,
                          });
                          setHoveredItem(accessory.id);
                        }
                      } else {
                        onAccessoryClick(accessory.id);
                      }
                    }}
                    className={`aspect-square w-full flex items-center justify-center rounded-xl transition-all relative overflow-hidden ${
                      accessory.locked
                        ? 'bg-white border-2 border-gray-300 cursor-pointer'
                        : accessory.unavailable
                        ? 'bg-gray-100 border-2 border-gray-400 cursor-pointer opacity-60'
                        : isEquipped
                        ? 'bg-white border-2 border-[#FF7070]'
                        : 'bg-white border-2 border-black'
                    }`}
                  >
                    {accessory.locked ? (
                      <div className="flex items-center justify-center">
                        <LockIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    ) : accessory.unavailable ? (
                      <>
                        <img
                          src={accessory.icon}
                          alt={accessory.name}
                          className="max-w-[80%] max-h-[80%] object-contain opacity-40"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">🚫</span>
                        </div>
                      </>
                    ) : (
                      <img
                        src={accessory.icon}
                        alt={accessory.name}
                        className="max-w-[80%] max-h-[80%] object-contain"
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
