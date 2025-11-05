import type { ShopAccessory } from '../../types/shop';
import PointIcon from '../../assets/icons/pointIcon.svg';

interface ItemCardProps {
  item: ShopAccessory;
  onClick: () => void;
}

const ItemCard = ({ item, onClick }: ItemCardProps) => (
  <div
    className="flex items-center justify-between w-full p-5 bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-[#B5B5B5] cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between w-full">
      <div className="relative flex-shrink-0">
        <img
          src={item.icon}
          alt={item.name}
          className="w-22 h-22 rounded-xl border-2 border-[#A4A4A4]"
        />
        <div className="absolute top-[-4px] right-[-4px] w-5 h-5 bg-[#FF7070] rounded-full" />
      </div>

      <div className="flex flex-col items-start gap-4">
        <p className="text-xl font-bold text-gray-800">
          {item.name} {item.type}
        </p>
        <div className="flex justify-center items-center px-17 py-2.5 bg-[#FF7070] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <img src={PointIcon} alt="포인트" className="w-5 h-5" />
          <span className="font-bold text-white">{item.price}</span>
        </div>
      </div>
    </div>
  </div>
);

export default ItemCard;