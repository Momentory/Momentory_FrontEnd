import { useState, useEffect } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import Modal from '../../components/common/Modal';
import Bg from '../../assets/accessories/bgImg.svg';
import PointIcon from '../../assets/icons/pointIcon.svg';
import type { ShopItem } from '../../types/shop';
import EventCard from '../../components/Shop/EventCard';
import { getShopEvents, purchaseItem } from '../../api/shop';

const EventPage = () => {
  const [point, setPoint] = useState(1500);
  const [ownedAccessories, setOwnedAccessories] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [eventItems, setEventItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEventItems();
  }, []);

  const fetchEventItems = async () => {
    try {
      setIsLoading(true);
      const items = await getShopEvents();
      setEventItems(items || []);
    } catch (error) {
      console.error('이벤트 아이템 불러오기 실패:', error);
      setEventItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: ShopItem) => {
    if (ownedAccessories.includes(item.itemId)) {
      setToastMessage('이미 보유한 아이템입니다.');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }
    setSelectedItem(item);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;

    if (point < selectedItem.price) {
      setToastMessage('포인트가 부족합니다!');
      setSelectedItem(null);
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    try {
      await purchaseItem(selectedItem.itemId);
      setPoint(point - selectedItem.price);
      setOwnedAccessories([...ownedAccessories, selectedItem.itemId]);
      setToastMessage('구매가 성공적으로 완료되었습니다!');
      setSelectedItem(null);
      setTimeout(() => setToastMessage(''), 2000);
    } catch (error) {
      console.error('구매 실패:', error);
      setToastMessage('구매에 실패했습니다. 다시 시도해주세요.');
      setSelectedItem(null);
      setTimeout(() => setToastMessage(''), 2000);
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center overflow-hidden flex flex-col"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <DropdownHeader title="이벤트" />

      <main className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        {isLoading ? (
          <div className="text-white text-lg">로딩중...</div>
        ) : eventItems && eventItems.length > 0 ? (
          <div className="flex flex-col gap-4">
            {eventItems.map((item) => (
              <EventCard
                key={item.itemId}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        ) : (
          <EventCard item={null} onClick={() => {}} />
        )}
      </main>

      {selectedItem && (
        <Modal title="아이템 구입" onClose={() => setSelectedItem(null)}>
          <div className="flex flex-col items-center text-center px-3.5">
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              className="w-20 h-20 mb-4 rounded-xl border border-gray-200"
            />
            <p className="text-gray-700 mb-6 flex justify-center items-center flex-wrap px-4 text-center">
              <span className="whitespace-nowrap">
                <span className="text-[#FF7070] font-semibold">
                  [{selectedItem.name}]
                </span>{' '}
                {selectedItem.category}을(를)
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
