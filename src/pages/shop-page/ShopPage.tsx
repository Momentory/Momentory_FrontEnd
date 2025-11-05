import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import StarIcon from '../../assets/icons/starIcon.svg?react';
import EventIcon from '../../assets/icons/eventIcon.svg?react';
import RecentIcon from '../../assets/icons/recentAddItem.svg?react';
import RoseIcon from '../../assets/accessories/장미.svg';
import RibbonIcon from '../../assets/accessories/리본.svg';
import FeatherIcon from '../../assets/accessories/깃털.svg';
import HatIcon from '../../assets/accessories/모자.svg';
import ShopBottomSheet from '../../components/Shop/ShopBottomSheet';
import CharacterDisplay from '../../components/Shop/CharacterDisplay';
import useBottomSheet from '../../hooks/shop/useBottomSheet';
import Modal from '../../components/common/Modal';
import PointIcon from '../../assets/icons/pointIcon.svg';

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
  const [level] = useState(35);
  const [point, setPoint] = useState(1500);
  const [gem] = useState(2000);
  const [selectedCategory] = useState('장식');
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();
  const [equippedAccessories] = useState<number[]>([]);
  const [ownedAccessories, setOwnedAccessories] = useState<number[]>([1, 2]);
  const [selectedItem, setSelectedItem] = useState<ShopAccessory | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const shopAccessories: ShopAccessory[] = [
    {
      id: 1,
      name: '장미',
      icon: RoseIcon,
      locked: false,
      type: '장식',
      price: 100,
    },
    {
      id: 2,
      name: '리본',
      icon: RibbonIcon,
      locked: false,
      type: '장식',
      price: 150,
    },
    {
      id: 3,
      name: '깃털',
      icon: FeatherIcon,
      locked: false,
      type: 'body',
      price: 200,
    },
    {
      id: 4,
      name: '모자',
      icon: HatIcon,
      locked: false,
      type: '장식',
      price: 300,
    },
    { id: 5, name: '잠금1', icon: '', locked: true, type: '장식', price: 500 },
    { id: 6, name: '잠금2', icon: '', locked: true, type: 'body', price: 800 },
  ];

  // 액세서리 클릭
  const handleAccessoryClick = (id: number) => {
    const accessory = shopAccessories.find((acc) => acc.id === id);
    if (!accessory || accessory.locked) return;

    if (ownedAccessories.includes(id)) {
      return;
    }

    // 구매 확인 모달 띄우기
    setSelectedItem(accessory);
  };

  // 모달 내 "구매" 버튼 클릭
  const handleConfirmPurchase = () => {
    if (!selectedItem) return;

    if (point < selectedItem.price) {
      setToastMessage('포인트가 부족합니다!');
      setSelectedItem(null);
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    // 구매 성공
    setPoint(point - selectedItem.price);
    setOwnedAccessories([...ownedAccessories, selectedItem.id]);
    setToastMessage('구매가 성공적으로 완료되었습니다!');
    setSelectedItem(null);
    setTimeout(() => setToastMessage(''), 2000);
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

      {/* 하단 버튼들 */}
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

      {/* 하단 시트 */}
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
                {selectedItem.type}을(를)
              </span>
              <span className="w-1.5"></span>
              <span className="whitespace-nowrap inline-flex items-center">
                <img src={PointIcon} alt="포인트" className="w-4 h-4 mr-1" />
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
    </div>
  );
};

export default ShopPage;
