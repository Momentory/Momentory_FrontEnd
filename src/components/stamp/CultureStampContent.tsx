import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyStamps } from '../../hooks/stamp/useStampQueries';

import 고양킨텍스 from '../../assets/stamp/고양킨텍스.png';
import 서울대공원 from '../../assets/stamp/과천서울대공원.png';
import 광명동굴 from '../../assets/stamp/광명동굴.png';
import 한강유채꽃 from '../../assets/stamp/구리시한강유채꽃.png';
import 물의정원 from '../../assets/stamp/남양주시물의정원.png';
import 동두천계곡 from '../../assets/stamp/동두천계곡.png';
import 만화박물관 from '../../assets/stamp/한국만화박물관.png';
import 남한선성 from '../../assets/stamp/성남남한산성.png';
import 수원화성 from '../../assets/stamp/수원화성.png';
import 안산누에섬 from '../../assets/stamp/안산누에섬.png';
import 안양천 from '../../assets/stamp/안양천.png';
import 오산독산성 from '../../assets/stamp/오산독산성.png';
import 평택항 from '../../assets/stamp/평택항.png';
import 행복로 from '../../assets/stamp/행복로.png';

type StampStatus = 'ACQUIRED' | 'PREVIEW' | 'LOCKED';

interface StampInfo {
  id: number;
  name: string;
  image: string;
}

const CULTURE_STAMPS: StampInfo[] = [
  { id: 0, name: '고양킨텍스', image: 고양킨텍스 },
  { id: 1, name: '서울대공원', image: 서울대공원 },
  { id: 2, name: '광명동굴', image: 광명동굴 },
  { id: 3, name: '한강유채꽃', image: 한강유채꽃 },
  { id: 4, name: '물의정원', image: 물의정원 },
  { id: 5, name: '동두천계곡', image: 동두천계곡 },
  { id: 6, name: '만화박물관', image: 만화박물관 },
  { id: 7, name: '남한선성', image: 남한선성 },
  { id: 8, name: '수원화성', image: 수원화성 },
  { id: 9, name: '안산누에섬', image: 안산누에섬 },
  { id: 10, name: '안양천', image: 안양천 },
  { id: 11, name: '오산독산성', image: 오산독산성 },
  { id: 12, name: '평택항', image: 평택항 },
  { id: 13, name: '행복로', image: 행복로 },
];

const CheckIcon = () => (
  <div className="absolute flex items-center justify-center">
    <div className="absolute w-8 h-8 bg-white rounded-full opacity-90"></div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative text-gray-500"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  </div>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="27"
    height="27"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

interface StampItemProps {
  stamp: StampInfo;
  status: StampStatus;
  onClick: () => void;
}

const StampItem = ({ stamp, status, onClick }: StampItemProps) => {
  const isAcquired = status === 'ACQUIRED';
  const isPreview = status === 'PREVIEW';
  const isLocked = status === 'LOCKED';

  const imageSizeClass =
    stamp.id === 10 ? 'w-[108px] h-[88px]' : 'w-[68px] h-[68px]';

  const borderClass = isAcquired
    ? 'border-black'
    : isPreview
      ? 'border-gray-400 border-dashed opacity-70'
      : 'border-gray-300';

  const imageBlurStyle = isPreview ? { filter: 'blur(0.5px)' } : undefined;
  const imageBlurClass = isPreview ? 'blur-sm' : '';

  return (
    <div className="flex flex-col items-center" onClick={onClick}>
      <div
        className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer transition-all ${borderClass}`}
      >
        {!isLocked ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[10px]">
            <img
              src={stamp.image}
              alt={stamp.name}
              className={`${imageSizeClass} ${imageBlurClass} object-contain`}
              style={imageBlurStyle}
            />
            {isPreview && <CheckIcon />}
          </div>
        ) : (
          <LockIcon />
        )}
      </div>
      <p
        className={`mt-2 text-sm text-gray-700 ${
          !isLocked ? 'visible' : 'invisible'
        }`}
      >
        {stamp.name}
      </p>
    </div>
  );
};

export default function CultureStampContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'culture' | 'region'>('culture');

  const [acquiredIds, setAcquiredIds] = useState<Set<number>>(new Set());
  const [previewIds, setPreviewIds] = useState<Set<number>>(new Set());

  const { data: stampsData, isLoading } = useMyStamps('CULTURAL');

  const handleTabClick = (tab: 'culture' | 'region', path: string) => {
    setActiveTab(tab);
    setTimeout(() => navigate(path), 300);
  };

  const handleBoxClick = (id: number) => {
    if (acquiredIds.has(id)) return;

    setPreviewIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  useEffect(() => {
    if (!stampsData?.result || isLoading) return;

    const stamps = Array.isArray(stampsData.result)
      ? stampsData.result
      : stampsData.result.CULTURAL || [];
    const newAcquiredIds = new Set<number>();

    stamps.forEach((serverStamp) => {
      const spotName = serverStamp.spotName || '';

      const foundStamp = CULTURE_STAMPS.find((localStamp) => {
        const sName = spotName.replace(/\s/g, '');
        const lName = localStamp.name.replace(/\s/g, '');
        return sName.includes(lName) || lName.includes(sName);
      });

      if (foundStamp) {
        newAcquiredIds.add(foundStamp.id);
      }
    });

    setAcquiredIds(newAcquiredIds);
  }, [stampsData, isLoading]);

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen pb-20 relative">
      <div className="sticky top-[116px] z-30 bg-white">
        <div className="flex border-b-2 border-gray-300 relative">
          <div
            className="flex-1 p-4 bg-white rounded-lg flex items-center justify-center relative cursor-pointer"
            onClick={() =>
              handleTabClick('culture', '/stamp-collection/culture')
            }
          >
            <h2 className="text-lg font-semibold">문화 스탬프</h2>
          </div>

          <div
            className="flex-1 p-4 bg-white rounded-lg flex items-center justify-center relative cursor-pointer"
            onClick={() => handleTabClick('region', '/stamp-collection/region')}
          >
            <h2 className="text-lg font-semibold">지역 스탬프</h2>
          </div>

          <div
            className={`absolute bottom-[-2px] w-[50%] h-[3px] bg-[#FF7070] z-10 transition-all duration-300 ease-in-out transform ${
              activeTab === 'culture' ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="w-[195px] h-full mx-auto bg-[#FF7070]" />
          </div>
        </div>
      </div>

      <div className="p-5 pt-[30px]">
        <div className="grid grid-cols-4 gap-x-[18px] gap-y-[18px] justify-items-center">
          {CULTURE_STAMPS.map((stamp) => {
            let status: StampStatus = 'LOCKED';
            if (acquiredIds.has(stamp.id)) status = 'ACQUIRED';
            else if (previewIds.has(stamp.id)) status = 'PREVIEW';

            return (
              <StampItem
                key={stamp.id}
                stamp={stamp}
                status={status}
                onClick={() => handleBoxClick(stamp.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
