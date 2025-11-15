import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas-pro';
import DropdownHeader from '../../components/common/DropdownHeader';
import Modal from '../../components/common/Modal';
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
import { toS3WebsiteUrl } from '../../utils/s3';

const ClosetPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('DECORATION');
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();
  const captureRef = useRef<HTMLDivElement>(null);
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);
  const [showNoItemsModal, setShowNoItemsModal] = useState(false);

  const categoryDisplayMap: { [key in ItemCategory]: string } = {
    CLOTHING: '의상',
    EXPRESSION: '표정',
    EFFECT: '이펙트',
    DECORATION: '장식',
  };

  const { data: pointData } = useUserPoint();
  const { data: currentCharacter } = useCurrentCharacter();
  const { data: myItems = [], isLoading: myItemsLoading } = useMyItems(selectedCategory);
  const { data: shopItems = [], isLoading: shopItemsLoading } = useShopItems(selectedCategory);

  const isLoading = myItemsLoading || shopItemsLoading;

  const equipMutation = useEquipItem({
    onSuccess: () => {
      console.log('아이템 착용 성공');
    },
    onError: (error) => {
      console.error('아이템 착용 실패:', error);
      alert(`아이템 착용에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
    },
  });

  const unequipMutation = useUnequipItem({
    onSuccess: () => {
      console.log('아이템 해제 성공');
    },
    onError: (error) => {
      console.error('아이템 해제 실패:', error);
      alert(`아이템 해제에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
    },
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
      icon: toS3WebsiteUrl(item.imageUrl),
      locked: false,
      type: item.category.toLowerCase()
    }));

    const lockedAccessories = shopItems
      .filter(item => !ownedItemIds.has(item.itemId))
      .map(item => ({
        id: item.itemId,
        name: item.name,
        icon: toS3WebsiteUrl(item.imageUrl),
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
        icon: toS3WebsiteUrl(equipped.clothing.imageUrl),
        locked: false,
        type: 'clothing'
      });
    }
    if (equipped.expression) {
      equippedItems.push({
        id: equipped.expression.itemId,
        name: equipped.expression.name,
        icon: toS3WebsiteUrl(equipped.expression.imageUrl),
        locked: false,
        type: 'expression'
      });
    }
    if (equipped.effect) {
      equippedItems.push({
        id: equipped.effect.itemId,
        name: equipped.effect.name,
        icon: toS3WebsiteUrl(equipped.effect.imageUrl),
        locked: false,
        type: 'effect'
      });
    }
    if (equipped.decoration) {
      equippedItems.push({
        id: equipped.decoration.itemId,
        name: equipped.decoration.name,
        icon: toS3WebsiteUrl(equipped.decoration.imageUrl),
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
    console.log('아이템 클릭:', { id, accessory, currentCharacter });

    if (!accessory || accessory.locked || !currentCharacter) {
      console.log('클릭 무시:', {
        hasAccessory: !!accessory,
        isLocked: accessory?.locked,
        hasCharacter: !!currentCharacter
      });
      return;
    }
    const hasClothing = currentCharacter.equipped.clothing !== null;
    const isClothing = accessory.type.toUpperCase() === 'CLOTHING';
    if (hasClothing && !isClothing && !equippedAccessories.includes(id)) {
      alert('의상을 착용한 상태에서는 다른 아이템을 착용할 수 없습니다.');
      return;
    }
    if (isClothing && !equippedAccessories.includes(id)) {
      const hasOtherItems =
        currentCharacter.equipped.expression !== null ||
        currentCharacter.equipped.effect !== null ||
        currentCharacter.equipped.decoration !== null;

      if (hasOtherItems) {
        alert('다른 아이템을 착용한 상태에서는 의상을 착용할 수 없습니다.');
        return;
      }
    }

    if (equippedAccessories.includes(id)) {
      console.log('아이템 해제 시도:', { characterId: currentCharacter.characterId, itemId: id });
      unequipMutation.mutate({ characterId: currentCharacter.characterId, itemId: id });
    } else {
      const categoryKey = accessory.type.toLowerCase() as keyof typeof currentCharacter.equipped;
      const currentEquippedItem = currentCharacter.equipped[categoryKey];

      if (currentEquippedItem) {
        console.log('기존 아이템 해제 후 새 아이템 착용:', {
          oldItemId: currentEquippedItem.itemId,
          newItemId: id
        });
        unequipMutation.mutate(
          { characterId: currentCharacter.characterId, itemId: currentEquippedItem.itemId },
          {
            onSuccess: () => {
              console.log('기존 아이템 해제 완료, 새 아이템 착용 시작');
              equipMutation.mutate({ characterId: currentCharacter.characterId, itemId: id });
            },
          }
        );
      } else {
        console.log('새 아이템 착용 시도:', { characterId: currentCharacter.characterId, itemId: id });
        equipMutation.mutate({ characterId: currentCharacter.characterId, itemId: id });
      }
    }
  };

  const captureCharacter = async (): Promise<Blob | null> => {
    try {
      if (!captureRef.current) {
        throw new Error('캡처 대상을 찾을 수 없습니다.');
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error(`캔버스 크기가 0입니다: ${canvas.width}x${canvas.height}`);
      }

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob && blob.size > 0) {
            resolve(blob);
          } else {
            reject(new Error('Blob 생성 실패'));
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error('캡처 실패:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    const blob = await captureCharacter();
    if (!blob) {
      alert('이미지 다운로드에 실패했습니다.');
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `momentory-character-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const blob = await captureCharacter();
    if (!blob) {
      alert('이미지 공유에 실패했습니다.');
      return;
    }

    const file = new File([blob], `momentory-character-${Date.now()}.png`, { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Momentory 캐릭터',
          text: 'Momentory에서 꾸민 나만의 캐릭터!',
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('공유 실패:', error);
          alert('공유에 실패했습니다.');
        }
      }
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `momentory-character-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('이미지가 다운로드되었습니다.\n갤러리에서 인스타그램 스토리에 업로드해주세요!');
    }
  };

  const handleSelectCharacter = (characterType: 'CAT' | 'DOG') => {
    // TODO: 캐릭터 변경 API 연결
    console.log('캐릭터 변경:', characterType);
    alert(`${characterType === 'CAT' ? '고양이' : '강아지'}로 변경됩니다.`);
  };

  const handleRemoveAll = () => {
    if (!currentCharacter) return;
    const equipped = currentCharacter.equipped;
    const itemsToUnequip = [];

    if (equipped.clothing) itemsToUnequip.push(equipped.clothing.itemId);
    if (equipped.expression) itemsToUnequip.push(equipped.expression.itemId);
    if (equipped.effect) itemsToUnequip.push(equipped.effect.itemId);
    if (equipped.decoration) itemsToUnequip.push(equipped.decoration.itemId);

    if (itemsToUnequip.length === 0) {
      setShowNoItemsModal(true);
      return;
    }

    setShowRemoveAllModal(true);
  };

  const confirmRemoveAll = async () => {
    if (!currentCharacter) return;
    const equipped = currentCharacter.equipped;
    const itemsToUnequip = [];

    if (equipped.clothing) itemsToUnequip.push(equipped.clothing.itemId);
    if (equipped.expression) itemsToUnequip.push(equipped.expression.itemId);
    if (equipped.effect) itemsToUnequip.push(equipped.effect.itemId);
    if (equipped.decoration) itemsToUnequip.push(equipped.decoration.itemId);

    try {
      for (const itemId of itemsToUnequip) {
        await unequipMutation.mutateAsync({ characterId: currentCharacter.characterId, itemId });
      }
      console.log('모든 아이템 해제 완료');
      setShowRemoveAllModal(false);
    } catch (error) {
      console.error('아이템 해제 실패:', error);
      alert('아이템 해제에 실패했습니다.');
      setShowRemoveAllModal(false);
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
          ref={captureRef}
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
        <button className="w-14 h-14 rounded-full bg-[#FF7070] flex items-center justify-center shadow-lg cursor-pointer transition-colors" onClick={() => navigate('/my-closet')}
>
          <StarIcon className="w-8 h-8 text-white" />
        </button>
        <div className="flex flex-row gap-4">
        <button
          className="w-14 h-14 rounded-full bg-[#FF7070] flex items-center justify-center shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDownload}
          disabled={isExpanded}
        >
          <svg
            className="text-white w-8 h-8"
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
              className="flex w-14 h-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleShare}
              disabled={isExpanded}
            >
              <ShareIcon className="w-8 h-8 text-gray-700" />
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
        onSelectCharacter={handleSelectCharacter}
        onRemoveAll={handleRemoveAll}
        isLoading={isLoading}
      />

      {showRemoveAllModal && (
        <Modal title="아이템 모두 벗기" onClose={() => setShowRemoveAllModal(false)}>
          <div className="flex flex-col items-center text-center px-3.5 w-full">
            <p className="text-gray-700 mb-6">
              착용 중인<br/> 모든 아이템을 벗으시겠습니까?
            </p>

            <div className="flex w-full gap-4 justify-between">
              <button
                onClick={confirmRemoveAll}
                className="flex-1 whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold"
              >
                벗기
              </button>
              <button
                onClick={() => setShowRemoveAllModal(false)}
                className="whitespace-nowrap px-6 py-2 bg-[#EAEAEA] text-[#8D8D8D] rounded-lg font-semibold"
              >
                취소
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showNoItemsModal && (
        <Modal title="알림" onClose={() => setShowNoItemsModal(false)}>
          <div className="flex flex-col items-center text-center px-3.5 w-full">
            <p className="text-gray-700 mb-4">
              착용 중인 아이템이 없습니다.
            </p>

            <div className="flex w-full justify-center">
              <button
                onClick={() => setShowNoItemsModal(false)}
                className="whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold w-full"
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
};

export default ClosetPage;
