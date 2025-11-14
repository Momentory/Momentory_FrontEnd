import React from 'react';
import ChevronDown from '../../assets/icons/dropdown.svg?react';
import LockIcon from '../../assets/icons/lockIcon.svg?react';
import PointIcon from '../../assets/icons/pointIcon.svg?react';

interface ShopAccessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
  price: number;
  unlockLevel?: number;
}

export interface ShopBottomSheetProps {
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  accessories: ShopAccessory[];
  selectedCategory: string;
  ownedAccessories: number[];
  equippedAccessories: number[];
  onAccessoryClick: (id: number) => void;
  userPoints: number;
  onCategoryChange?: (category: string) => void;
}

export default function ShopBottomSheet({
  height,
  setHeight,
  isExpanded,
  setIsExpanded,
  accessories,
  selectedCategory,
  ownedAccessories,
  equippedAccessories,
  onAccessoryClick,
  userPoints,
  onCategoryChange,
}: ShopBottomSheetProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [hasMoved, setHasMoved] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (hoveredItem !== null) {
      const timer = setTimeout(() => {
        setHoveredItem(null);
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
          setHeight(500);
          setIsExpanded(true);
        } else if (deltaY < -50) {
          setHeight(100);
          setIsExpanded(false);
        } else {
          if (height > 300) {
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
            setHeight(350);
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
            setHeight(350);
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
      {hoveredItem && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 bg-black/90 text-white text-sm rounded-xl whitespace-nowrap z-[9999] shadow-xl max-w-[90%]">
          <div className="font-bold text-base mb-1">
            {accessories.find(a => a.id === hoveredItem)?.name}
          </div>
          {accessories.find(a => a.id === hoveredItem)?.unlockLevel && (
            <div className="text-gray-300 text-xs">
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
                <hr className="border-t border-stone-300" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange?.('DECORATION');
                    setIsDropdownOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="text-left text-[#727272] text-xs font-bold tracking-tight px-6 py-3"
                >
                  장식
                </button>
              </div>
            </div>
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
        <div className="grid grid-cols-4 gap-3">
          {accessories.map((accessory) => {
            const isOwned = ownedAccessories.includes(accessory.id);
            const isEquipped = equippedAccessories.includes(accessory.id);
            const canAfford = userPoints >= accessory.price;
            const isLocked = accessory.locked;

            return (
              <div key={accessory.id} className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    if (isLocked) {
                      setHoveredItem(hoveredItem === accessory.id ? null : accessory.id);
                    } else if (!isOwned) {
                      onAccessoryClick(accessory.id);
                    }
                  }}
                  disabled={isOwned}
                  className={`aspect-square w-full flex items-center justify-center rounded-xl transition-all relative overflow-hidden ${
                    isLocked
                      ? 'bg-white border-2 border-gray-300 cursor-pointer'
                      : isOwned
                      ? 'bg-white border-2 border-[#FF7070] cursor-default'
                      : isEquipped
                      ? 'bg-pink-50 border-2 border-[#FF7070]'
                      : canAfford
                      ? 'bg-white border-2 border-black hover:border-[#FF7070]'
                      : 'bg-gray-50 border-2 border-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLocked ? (
                    <div className="flex items-center justify-center">
                      <LockIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  ) : (
                    <>
                      <img
                        src={accessory.icon}
                        alt={accessory.name}
                        className="max-w-[80%] max-h-[80%] object-contain"
                      />
                      {isOwned && (
                        <div className="absolute bottom-1 right-1 bg-[#FF7070] rounded-full w-5 h-5 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </>
                  )}
                </button>
                {!isOwned && (
                  <div className="flex items-center gap-0.5">
                    <PointIcon className="w-4 h-4" />
                    <span
                      className={`text-xs font-bold ${
                        isLocked ? 'text-gray-400' : canAfford ? 'text-black' : 'text-red-500'
                      }`}
                    >
                      {isLocked ? '???' : accessory.price}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
}

