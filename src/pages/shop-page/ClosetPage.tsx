import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import StarIcon from '../../assets/icons/starIcon.svg?react';
import ShareIcon from '../../assets/icons/albumShare.svg?react';
import ShopIcon from '../../assets/accessories/shop.svg?react';
import CatImage from '../../assets/accessories/cat.svg';
import DogImage from '../../assets/accessories/dog.svg';
import BottomSheet from '../../components/Shop/BottomSheet';
import type { Accessory } from '../../components/Shop/BottomSheet';
import CharacterDisplay from '../../components/Shop/CharacterDisplay';
import useBottomSheet from '../../hooks/shop/useBottomSheet';
import { useUserPoint, useCurrentCharacter, useMyItems, useShopItems } from '../../hooks/shop/useShopQueries';
import { useEquipItem, useUnequipItem } from '../../hooks/shop/useEquipItem';
import type { ItemCategory } from '../../types/shop';

const ClosetPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('DECORATION');
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();

  const categoryDisplayMap: { [key in ItemCategory]: string } = {
    CLOTHING: '의상',
    EXPRESSION: '표정',
    EFFECT: '이펙트',
    DECORATION: '장식',
  };

  const { data: pointData } = useUserPoint();
  const { data: currentCharacter } = useCurrentCharacter();
  const { data: myItems = [] } = useMyItems(selectedCategory);
  const { data: shopItems = [] } = useShopItems(selectedCategory);

  const equipMutation = useEquipItem({
    onError: (error) => console.error('아이템 착용 실패:', error),
  });

  const unequipMutation = useUnequipItem({
    onError: (error) => console.error('아이템 해제 실패:', error),
  });

  const level = currentCharacter?.level || 1;
  const point = pointData?.userPoint.currentPoint || 0;
  const gem = pointData?.userPoint.totalPoint || 0;

  const characterImage = useMemo(() => {
    if (!currentCharacter) return CatImage;
    return currentCharacter.characterType === 'CAT' ? CatImage : DogImage;
  }, [currentCharacter]);

  const equippedAccessories = useMemo(() => {
    if (!currentCharacter) return [];
    const equippedItemIds: number[] = [];
    if (currentCharacter.equipped.clothing) equippedItemIds.push(currentCharacter.equipped.clothing.itemId);
    if (currentCharacter.equipped.expression) equippedItemIds.push(currentCharacter.equipped.expression.itemId);
    if (currentCharacter.equipped.effect) equippedItemIds.push(currentCharacter.equipped.effect.itemId);
    if (currentCharacter.equipped.decoration) equippedItemIds.push(currentCharacter.equipped.decoration.itemId);
    return equippedItemIds;
  }, [currentCharacter]);

  const accessories: Accessory[] = useMemo(() => {
    const ownedItemIds = new Set(myItems.map(item => item.itemId));

    const ownedAccessories = myItems.map(item => ({
      id: item.itemId,
      name: item.name,
      icon: item.imageUrl,
      locked: false,
      type: item.category.toLowerCase()
    }));

    const lockedAccessories = shopItems
      .filter(item => !ownedItemIds.has(item.itemId))
      .map(item => ({
        id: item.itemId,
        name: item.name,
        icon: item.imageUrl,
        locked: true,
        type: item.category.toLowerCase(),
        unlockLevel: item.unlockLevel
      }));

    return [...ownedAccessories, ...lockedAccessories];
  }, [myItems, shopItems]);

  const allEquippedAccessories: Accessory[] = useMemo(() => {
    if (!currentCharacter) return [];

    const equipped = currentCharacter.equipped;
    const equippedItems: Accessory[] = [];

    if (equipped.clothing) {
      equippedItems.push({
        id: equipped.clothing.itemId,
        name: equipped.clothing.name,
        icon: equipped.clothing.imageUrl,
        locked: false,
        type: 'clothing'
      });
    }
    if (equipped.expression) {
      equippedItems.push({
        id: equipped.expression.itemId,
        name: equipped.expression.name,
        icon: equipped.expression.imageUrl,
        locked: false,
        type: 'expression'
      });
    }
    if (equipped.effect) {
      equippedItems.push({
        id: equipped.effect.itemId,
        name: equipped.effect.name,
        icon: equipped.effect.imageUrl,
        locked: false,
        type: 'effect'
      });
    }
    if (equipped.decoration) {
      equippedItems.push({
        id: equipped.decoration.itemId,
        name: equipped.decoration.name,
        icon: equipped.decoration.imageUrl,
        locked: false,
        type: 'decoration'
      });
    }

    return equippedItems;
  }, [currentCharacter]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as ItemCategory);
  };

  const handleAccessoryClick = (id: number) => {
    const accessory = accessories.find((acc) => acc.id === id);
    if (!accessory || accessory.locked || !currentCharacter) return;

    if (equippedAccessories.includes(id)) {
      unequipMutation.mutate({ characterId: currentCharacter.characterId, itemId: id });
    } else {
      const categoryKey = accessory.type.toLowerCase() as keyof typeof currentCharacter.equipped;
      const currentEquippedItem = currentCharacter.equipped[categoryKey];

      if (currentEquippedItem) {
        unequipMutation.mutate(
          { characterId: currentCharacter.characterId, itemId: currentEquippedItem.itemId },
          {
            onSuccess: () => {
              equipMutation.mutate({ characterId: currentCharacter.characterId, itemId: id });
            },
          }
        );
      } else {
        equipMutation.mutate({ characterId: currentCharacter.characterId, itemId: id });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <DropdownHeader
        title="캐릭터 옷장"
        rightItem={
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center justify-center w-8 h-8 cursor-pointer"
          >
            <ShopIcon className="w-6 h-6" />
          </button>
        }
      />

      <div className="flex-1 flex flex-col">
        <CharacterDisplay
          level={level}
          point={point}
          gem={gem}
          equippedAccessories={equippedAccessories}
          accessories={allEquippedAccessories}
          characterImage={characterImage}
          characterType={currentCharacter?.characterType}
          bottomSheetHeight={height}
        />

      <div
        className="fixed max-w-[480px] mx-auto px-4 left-0 right-0 flex justify-between items-center gap-4 z-[100] pointer-events-auto transition-all duration-300"
        style={{ bottom: `${height + 16}px` }}
      >
        <button className="w-12 h-12 rounded-full bg-[#FF7070] flex items-center justify-center shadow-lg cursor-pointer transition-colors" onClick={() => navigate('/my-closet')}
>
          <StarIcon className="w-6 h-6 text-white" />
        </button>
        <div className="flex flex-row gap-4">
        <button className="w-12 h-12 rounded-full bg-[#FF7070] flex items-center justify-center shadow-lg cursor-pointer transition-colors">
          <svg
            className="text-white w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
        <button
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition cursor-pointer"
              onClick={()=> alert('공유 기능 추후 구현.')}
            >
              <ShareIcon className="h-6 w-6 text-gray-700" />
            </button>
        </div>
      </div>

      <BottomSheet
        height={height}
        setHeight={setHeight}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        accessories={accessories}
        selectedCategory={categoryDisplayMap[selectedCategory]}
        equippedAccessories={equippedAccessories}
        onAccessoryClick={handleAccessoryClick}
        onCategoryChange={handleCategoryChange}
      />
      </div>
    </div>
  );
};

export default ClosetPage;
