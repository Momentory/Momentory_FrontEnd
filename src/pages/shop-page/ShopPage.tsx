import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import StarIcon from '../../assets/icons/starIcon.svg?react';
import EventIcon from '../../assets/icons/eventIcon.svg?react';
import RecentIcon from '../../assets/icons/recentAddItem.svg?react';
import ClosetIcon from '../../assets/accessories/closet.svg?react';
import CatImage from '../../assets/accessories/cat.svg';
import DogImage from '../../assets/accessories/dog.svg';
import ShopBottomSheet from '../../components/Shop/ShopBottomSheet';
import CharacterDisplay from '../../components/Shop/CharacterDisplay';
import useBottomSheet from '../../hooks/shop/useBottomSheet';
import { useUserPoint, useCurrentCharacter, useShopItems } from '../../hooks/shop/useShopQueries';
import { usePurchaseItem } from '../../hooks/shop/usePurchaseItem';
import Modal from '../../components/common/Modal';
import PointIcon from '../../assets/icons/pointIcon.svg?react';
import type { ItemCategory } from '../../types/shop';

interface ShopAccessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
  price: number;
}

const ShopPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('DECORATION');
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();
  const [selectedItem, setSelectedItem] = useState<ShopAccessory | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const categoryDisplayMap: { [key in ItemCategory]: string } = {
    CLOTHING: '의상',
    EXPRESSION: '표정',
    EFFECT: '이펙트',
    DECORATION: '장식',
  };

  const getCategoryName = (category: string): string => {
    return categoryDisplayMap[category as ItemCategory] || category;
  };

  const { data: pointData } = useUserPoint();
  const { data: currentCharacter } = useCurrentCharacter();
  const { data: shopItems = [], isLoading } = useShopItems(selectedCategory);

  const purchaseMutation = usePurchaseItem({
    currentCategory: selectedCategory,
    onSuccess: () => {
      setToastMessage('구매가 성공적으로 완료되었습니다!');
      setSelectedItem(null);
      setTimeout(() => setToastMessage(''), 2000);
    },
    onError: (error: any) => {
      console.error('구매 실패:', error);
      const errorMessage = error.response?.data?.message || '구매에 실패했습니다.';
      setToastMessage(errorMessage);
      setSelectedItem(null);
      setTimeout(() => setToastMessage(''), 2000);
    },
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as ItemCategory);
  };

  const characterImage = useMemo(() => {
    if (!currentCharacter) return CatImage;
    return currentCharacter.characterType === 'CAT' ? CatImage : DogImage;
  }, [currentCharacter]);

  const level = currentCharacter?.level || 1;
  const point = pointData?.userPoint.currentPoint || 0;
  const gem = pointData?.userPoint.totalPoint || 0;

  const equippedAccessories = useMemo(() => {
    if (!currentCharacter) return [];
    const equippedItemIds: number[] = [];
    if (currentCharacter.equipped.clothing) equippedItemIds.push(currentCharacter.equipped.clothing.itemId);
    if (currentCharacter.equipped.expression) equippedItemIds.push(currentCharacter.equipped.expression.itemId);
    if (currentCharacter.equipped.effect) equippedItemIds.push(currentCharacter.equipped.effect.itemId);
    if (currentCharacter.equipped.decoration) equippedItemIds.push(currentCharacter.equipped.decoration.itemId);
    return equippedItemIds;
  }, [currentCharacter]);

  const ownedAccessories = useMemo(() => {
    return shopItems.filter((item) => item.owned).map((item) => item.itemId);
  }, [shopItems]);

  const shopAccessories: ShopAccessory[] = shopItems.map((item) => ({
    id: item.itemId,
    name: item.name,
    icon: item.imageUrl,
    locked: item.unlockLevel > level,
    type: item.category,
    price: item.price,
  }));

  const handleAccessoryClick = (id: number) => {
    const accessory = shopAccessories.find((acc) => acc.id === id);
    if (!accessory || accessory.locked) return;

    if (ownedAccessories.includes(id)) {
      return;
    }

    setSelectedItem(accessory);
  };

  const handleConfirmPurchase = () => {
    if (!selectedItem) return;

    if (point < selectedItem.price) {
      setToastMessage('포인트가 부족합니다!');
      setSelectedItem(null);
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    purchaseMutation.mutate(selectedItem.id);
  };

  const displayAccessories = shopAccessories.map((acc) => ({
    id: acc.id,
    name: acc.name,
    icon: acc.icon,
    locked: acc.locked,
    type: acc.type,
  }));

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <DropdownHeader
        title="상점"
        rightItem={
          <button
            onClick={() => navigate('/closet')}
            className="flex items-center justify-center w-8 h-8 cursor-pointer"
          >
            <ClosetIcon className="w-6 h-6" />
          </button>
        }
      />

      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">상점 아이템을 불러오는 중...</p>
          </div>
        ) : (
          <>
            <CharacterDisplay
              level={level}
              point={point}
              gem={gem}
              equippedAccessories={equippedAccessories}
              accessories={displayAccessories}
              characterImage={characterImage}
            />

      <div
        className="fixed max-w-[480px] mx-auto px-4 left-0 right-0 flex justify-between items-center gap-4 z-[100] pointer-events-auto transition-all duration-300"
        style={{ bottom: `${height + 16}px` }}
      >
        <button className="w-12 h-12 rounded-full bg-[#FF7070] flex items-center justify-center shadow-lg cursor-pointer transition-colors">
          <StarIcon className="w-6 h-6 text-white" />
        </button>
        <div className="flex flex-row gap-4">
          <button
            className="w-12 h-12 rounded-full bg-[#FF7070] flex items-center justify-center shadow-lg cursor-pointer transition-colors hover:bg-[#FF5555]"
            onClick={() => navigate('new')}
          >
            <RecentIcon className="w-6 h-6" />
          </button>
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition cursor-pointer"
            onClick={() => navigate('event')}
          >
            <EventIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <ShopBottomSheet
        height={height}
        setHeight={setHeight}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        accessories={shopAccessories}
        selectedCategory={categoryDisplayMap[selectedCategory]}
        ownedAccessories={ownedAccessories}
        equippedAccessories={equippedAccessories}
        onAccessoryClick={handleAccessoryClick}
        userPoints={point}
        onCategoryChange={handleCategoryChange}
      />

      {selectedItem && (
        <Modal title="아이템 구입" onClose={() => setSelectedItem(null)}>
          <div className="flex flex-col items-center text-center px-3.5">
            <img
              src={selectedItem.icon}
              alt={selectedItem.name}
              className="w-20 h-20 mb-4 rounded-xl border border-gray-200"
            />
            <p className="text-gray-700 mb-6 flex justify-center items-center flex-wrap px-4 text-center">
              <span className="whitespace-nowrap">
                <span className="text-[#FF7070] font-semibold">
                  [{selectedItem.name}]
                </span>{' '}
                {getCategoryName(selectedItem.type)}을(를)
              </span>
              <span className="w-1.5"></span>
              <span className="whitespace-nowrap inline-flex items-center">
                <PointIcon className="w-4 h-4 mr-1" />
                {selectedItem.price}
                <span className="ml-1">에 구입할까요?</span>
              </span>
            </p>

            <div className="flex w-full gap-4 justify-between">
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold">
                구입하기
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="whitespace-nowrap px-6 py-2 bg-[#EAEAEA] text-[#8D8D8D] rounded-lg font-semibold">
                취소
              </button>
            </div>
          </div>
        </Modal>
      )}

          {toastMessage && (
            <div className="fixed bottom-10 left-5 right-5 rounded-3xl bg-black/50 px-4 py-2 text-center text-base font-bold text-white animate-fade-in z-[1000]">
              {toastMessage}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default ShopPage;
