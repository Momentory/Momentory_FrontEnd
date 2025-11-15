import type { ShopAccessory, ItemCategory } from '../../types/shop';
import PointIcon from '../../assets/icons/pointIcon.svg';

interface ItemCardProps {
  item: ShopAccessory;
  onClick: () => void;
}

const categoryDisplayMap: { [key in ItemCategory]: string } = {
  CLOTHING: '의상',
  EXPRESSION: '표정',
  EFFECT: '이펙트',
  DECORATION: '장식',
};

const getCategoryName = (category: string): string => {
  return categoryDisplayMap[category as ItemCategory] || category;
};

const ItemCard = ({ item, onClick }: ItemCardProps) => (
  <div
    className="flex items-center w-full p-5 bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-[#B5B5B5] cursor-pointer gap-10"
    onClick={onClick}
  >
    <div className="relative flex-shrink-0">
      <img
        src={item.icon}
        alt={item.name}
        className="w-20 h-20 rounded-xl border-2 border-[#A4A4A4]"
      />
      <div className="absolute top-[-4px] right-[-4px] w-5 h-5 bg-[#FF7070] rounded-full" />
    </div>

    <div className="flex flex-col items-start gap-2 flex-1">
      <p className="text-xl font-bold text-gray-800">
          {item.name} {getCategoryName(item.type)}
        </p>
      <div className="flex justify-center items-center gap-1 px-4 py-2 bg-[#FF7070] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full">
        <img src={PointIcon} alt="포인트" className="w-5 h-5" />
        <span className="font-bold text-white">{item.price}</span>
      </div>
    </div>
  </div>
);

export default ItemCard;