import type { ShopAccessory } from '../../types/shop';
import PointIcon from '../../assets/icons/pointIcon.svg';
import NoEventIcon from '../../assets/icons/noEvent.svg?react';

interface EventCardProps {
  item: ShopAccessory | null;
  onClick: () => void;
  children?: React.ReactNode;
}

const EventCard = ({ item, onClick, children }: EventCardProps) => (
  <div className="w-full max-w-sm bg-white rounded-b-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
    <div className="py-2 text-center text-white bg-[#FF7070] text-2xl font-bold">
      이벤트
    </div>
    <div className="flex flex-col items-center gap-3 p-6">
      {children ? (
        children
      ) : item ? (
        <>
          <div className="rounded-xl p-[3px] bg-gradient-to-b from-[#F5A753] to-[#A97742]">
            <div className="bg-white rounded-lg">
              <img src={item.icon} alt={item.name} className="w-20 h-20" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-[#D24848]">{item.name}</h2>
          <p className="text-sm text-gray-500">{item.description}</p>
          <button
            onClick={onClick}
            className="flex items-center justify-center gap-2 px-10 py-3 mt-5 cursor-pointer text-lg font-bold text-white bg-[#FF7070] rounded-[20px]"
          >
            <img src={PointIcon} alt="포인트" className="w-5 h-5" />
            {item.price}
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <NoEventIcon className="mb-4" />
          <p className="text-[#939393] text-xl font-bold">현재 진행중인 이벤트가 없어요!</p>
        </div>
      )}
    </div>
  </div>
);

export default EventCard;