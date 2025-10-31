import { useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import StarIcon from '../../assets/icons/starIcon.svg?react';
import ShareIcon from '../../assets/icons/albumShare.svg?react';
import RoseIcon from '../../assets/accessories/장미.svg';
import RibbonIcon from '../../assets/accessories/리본.svg';
import FeatherIcon from '../../assets/accessories/깃털.svg';
import HatIcon from '../../assets/accessories/모자.svg';
import ShopBottomSheet from '../../components/Shop/ShopBottomSheet';
import CharacterDisplay from '../../components/Shop/CharacterDisplay';
import useBottomSheet from '../../hooks/shop/useBottomSheet';

interface ShopAccessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
  price: number;
}

const ShopPage = () => {
  const [level] = useState(35);
  const [point, setPoint] = useState(1500);
  const [gem] = useState(2000);
  const [selectedCategory] = useState('장식');
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();
  const [equippedAccessories, setEquippedAccessories] = useState<number[]>([]);
  const [ownedAccessories, setOwnedAccessories] = useState<number[]>([1, 2]); // 이미 보유한 액세서리

  // 상점 액세서리
  const shopAccessories: ShopAccessory[] = [
    { id: 1, name: '장미', icon: RoseIcon, locked: false, type: 'head', price: 100 },
    { id: 2, name: '리본', icon: RibbonIcon, locked: false, type: 'head', price: 150 },
    { id: 3, name: '깃털', icon: FeatherIcon, locked: false, type: 'body', price: 200 },
    { id: 4, name: '모자', icon: HatIcon, locked: false, type: 'head', price: 300 },
    { id: 5, name: '잠금1', icon: '', locked: true, type: 'head', price: 500 },
    { id: 6, name: '잠금2', icon: '', locked: true, type: 'body', price: 800 },
  ];

  // 액세서리 클릭 - 미리보기 착용/해제
  const handleAccessoryClick = (id: number) => {
    const accessory = shopAccessories.find((acc) => acc.id === id);
    if (!accessory || accessory.locked) return;

    // 이미 보유한 액세서리는 클릭 불가
    if (ownedAccessories.includes(id)) {
      return;
    }

    // 미리보기 착용/해제
    if (equippedAccessories.includes(id)) {
      setEquippedAccessories(equippedAccessories.filter((accId) => accId !== id));
    } else {
      // 같은 타입 액세서리는 하나만 착용
      const newEquipped = equippedAccessories.filter(
        (accId) => shopAccessories.find((acc) => acc.id === accId)?.type !== accessory.type
      );
      setEquippedAccessories([...newEquipped, id]);
    }
  };

  // 다운로드 버튼 - 착용된 액세서리 구매
  const handlePurchase = () => {
    // 착용된 액세서리 중 미보유 액세서리만 필터링
    const itemsToPurchase = equippedAccessories.filter(
      (id) => !ownedAccessories.includes(id)
    );

    if (itemsToPurchase.length === 0) {
      alert('구매할 장식을 착용해주세요!');
      return;
    }

    // 총 가격 계산
    const totalPrice = itemsToPurchase.reduce((sum, id) => {
      const accessory = shopAccessories.find((acc) => acc.id === id);
      return sum + (accessory?.price || 0);
    }, 0);

    // 포인트 부족 확인
    if (point < totalPrice) {
      alert(`포인트가 부족합니다! (필요: ${totalPrice}, 보유: ${point})`);
      return;
    }

    // 구매 확인
    const itemNames = itemsToPurchase
      .map((id) => shopAccessories.find((acc) => acc.id === id)?.name)
      .join(', ');

    if (window.confirm(`${itemNames}을(를) ${totalPrice} 포인트에 구매하시겠습니까?`)) {
      setPoint(point - totalPrice);
      setOwnedAccessories([...ownedAccessories, ...itemsToPurchase]);
      alert('구매 완료!');
    }
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
      <DropdownHeader title="상점" />

      <CharacterDisplay
        level={level}
        gem={gem}
        point={point}
        equippedAccessories={equippedAccessories}
        accessories={displayAccessories}
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
          onClick={handlePurchase}
        >
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
            onClick={() => alert('공유 기능 추후 구현.')}
          >
            <ShareIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>

      <ShopBottomSheet
        height={height}
        setHeight={setHeight}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        accessories={shopAccessories}
        selectedCategory={selectedCategory}
        ownedAccessories={ownedAccessories}
        equippedAccessories={equippedAccessories}
        onAccessoryClick={handleAccessoryClick}
        userPoints={point}
      />
    </div>
  );
};

export default ShopPage;

