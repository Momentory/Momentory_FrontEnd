import React from 'react';
import ChevronDown from '../../assets/icons/dropdown.svg?react';
import LockIcon from '../../assets/icons/albumShare.svg?react';
import PointIcon from '../../assets/icons/pointIcon.svg?react';

interface ShopAccessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
  price: number;
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
}: ShopBottomSheetProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [hasMoved, setHasMoved] = React.useState(false);

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
    e.preventDefault();
    setIsDragging(true);
    setHasMoved(false);

    const startY = e.touches[0].clientY;
    const startHeight = height;

    const onMove = (e: TouchEvent) => {
      const deltaY = Math.abs(startY - e.touches[0].clientY);
      if (deltaY > 10) setHasMoved(true);
      const actualDeltaY = startY - e.touches[0].clientY;
      const newHeight = Math.max(100, Math.min(460, startHeight + actualDeltaY));
      setHeight(newHeight);
    };

    const onEnd = (e: TouchEvent) => {
      e.preventDefault();
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
        className="cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-20 h-1 bg-[#E2E2E2] rounded-full mx-auto mt-4" />

        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-1">
            <span className="text-[25px] font-bold text-gray-800">
              {selectedCategory}
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-[360px]">
          {accessories.map((accessory) => {
            const isOwned = ownedAccessories.includes(accessory.id);
            const isEquipped = equippedAccessories.includes(accessory.id);
            const canAfford = userPoints >= accessory.price;
            const isLocked = accessory.locked;

            return (
              <div key={accessory.id} className="flex flex-col items-center gap-1">
                <button
                  onClick={() => onAccessoryClick(accessory.id)}
                  disabled={isLocked || isOwned}
                  className={`aspect-square w-full flex items-center justify-center rounded-xl transition-all relative ${
                    isLocked
                      ? 'bg-white border-2 border-gray-300 cursor-not-allowed'
                      : isOwned
                      ? 'bg-green-50 border-2 border-green-400 cursor-default'
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
                        className={`max-w-[60%] max-h-[60%] object-contain ${
                          !canAfford ? 'opacity-40' : 'opacity-100'
                        }`}
                      />
                      {isOwned && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                          보유
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
  );
}

