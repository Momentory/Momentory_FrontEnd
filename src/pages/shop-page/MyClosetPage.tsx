import { useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import StarIcon from '../../assets/icons/starIcon.svg?react';
import ShareIcon from '../../assets/icons/albumShare.svg?react';
import RoseIcon from '../../assets/accessories/장미.svg';
import RibbonIcon from '../../assets/accessories/리본.svg';
import FeatherIcon from '../../assets/accessories/깃털.svg';
import HatIcon from '../../assets/accessories/모자.svg';
import BottomSheet from '../../components/Shop/BottomSheet';
import CharacterDisplay from '../../components/Shop/CharacterDisplay';
import useBottomSheet from '../../hooks/shop/useBottomSheet';

interface Accessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
}

const MyClosetPage = () => {
  const [level] = useState(35);
  const [point] = useState(1500);
  const [gem] = useState(2000);
  const [selectedCategory] = useState('장식');
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();
  const [equippedAccessories, setEquippedAccessories] = useState<number[]>([]);

  const accessories: Accessory[] = [
    { id: 1, name: '장미', icon: RoseIcon, locked: false, type: 'head' },
    { id: 2, name: '리본', icon: RibbonIcon, locked: false, type: 'head' },
    { id: 3, name: '깃털', icon: FeatherIcon, locked: true, type: 'body' },
    { id: 4, name: '모자', icon: HatIcon, locked: true, type: 'head' },
  ];

  const handleAccessoryClick = (id: number) => {
    const accessory = accessories.find((acc) => acc.id === id);
    if (!accessory || accessory.locked) return;

    if (equippedAccessories.includes(id)) {
      setEquippedAccessories(equippedAccessories.filter((accId) => accId !== id));
    } else {
      // 같은 타입 액세서리는 하나만 착용
      const newEquipped = equippedAccessories.filter(
        (accId) => accessories.find((acc) => acc.id === accId)?.type !== accessory.type
      );
      setEquippedAccessories([...newEquipped, id]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <DropdownHeader title="캐릭터 옷장" />

      <CharacterDisplay
        level={level}
        gem={gem}
        point={point}
        equippedAccessories={equippedAccessories}
        accessories={accessories}
      />

      <div
        className="fixed max-w-[480px] mx-auto px-4 left-0 right-0 flex justify-between items-center gap-4 z-[100] pointer-events-auto transition-all duration-300"
        style={{ bottom: `${height + 16}px` }}
      >
        <button className="w-12 h-12 rounded-full bg-[#FF7070] flex items-center justify-center shadow-lg cursor-pointer transition-colors">
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
        selectedCategory={selectedCategory}
        equippedAccessories={equippedAccessories}
        onAccessoryClick={handleAccessoryClick}
      />
    </div>
  );
};

export default MyClosetPage;
