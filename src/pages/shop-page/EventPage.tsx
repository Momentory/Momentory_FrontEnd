import { useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import Modal from '../../components/common/Modal';
import Bg from '../../assets/accessories/bgImg.svg';
import SparkleIcon from '../../assets/accessories/sparkle.svg';
import PointIcon from '../../assets/icons/pointIcon.svg';
import type { ShopAccessory } from '../../types/shop';
import EventCard from '../../components/Shop/EventCard';

const EventPage = () => {
  const [point, setPoint] = useState(1500);
  const [ownedAccessories, setOwnedAccessories] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<ShopAccessory | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const eventItem: ShopAccessory = {
    id: 101,
    name: '빛 이벤트',
    icon: SparkleIcon,
    type: '장식',
    price: 999,
    description: '한정 기간! D-7 남음',
  };

  const handleItemClick = (item: ShopAccessory) => {
    if (ownedAccessories.includes(item.id)) {
      setToastMessage('이미 보유한 아이템입니다.');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }
    setSelectedItem(item);
  };

  const handleConfirmPurchase = () => {
    if (!selectedItem) return;

    if (point < selectedItem.price) {
      setToastMessage('포인트가 부족합니다!');
      setSelectedItem(null);
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    setPoint(point - selectedItem.price);
    setOwnedAccessories([...ownedAccessories, selectedItem.id]);
    setToastMessage('구매가 성공적으로 완료되었습니다!');
    setSelectedItem(null);
    setTimeout(() => setToastMessage(''), 2000);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <DropdownHeader title="이벤트" />

      <main className="flex items-center justify-center p-4 pt-10">
        <EventCard
          item={eventItem}
          onClick={() => handleItemClick(eventItem)}
        />
      </main>

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
                className="flex-1 whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold"
              >
                구입하기
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="whitespace-nowrap px-6 py-2 bg-[#EAEAEA] text-[#8D8D8D] rounded-lg font-semibold"
              >
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

export default EventPage;
