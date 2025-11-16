import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyStamps } from '../../hooks/stamp/useStampQueries';
import { extractRegionName } from '../../utils/stampUtils';

import 광주 from '../../assets/stamp/광주.png';
import 김포 from '../../assets/stamp/김포.png';
import 시흥 from '../../assets/stamp/시흥.png';
import 안성 from '../../assets/stamp/안성.png';
import 연천 from '../../assets/stamp/연천.png';
import 의정부 from '../../assets/stamp/의정부.png';
import 파주 from '../../assets/stamp/파주.png';
import 가평 from '../../assets/stamp/가평.png';
import 고양 from '../../assets/stamp/고양.png';
import 과천 from '../../assets/stamp/과천.png';
import 광명 from '../../assets/stamp/광명.png';
import 구리 from '../../assets/stamp/구리.png';
import 군포 from '../../assets/stamp/군포.png';
import 남양주 from '../../assets/stamp/남양주.png';
import 동두천 from '../../assets/stamp/동두천.png';
import 부천 from '../../assets/stamp/부천.png';
import 성남 from '../../assets/stamp/성남.png';
import 수원 from '../../assets/stamp/수원.png';
import 안산 from '../../assets/stamp/안산.png';
import 안양 from '../../assets/stamp/안양.png';
import 양주 from '../../assets/stamp/양주.png';
import 양평군 from '../../assets/stamp/양평군.png';
import 여주 from '../../assets/stamp/여주.png';
import 오산 from '../../assets/stamp/오산.png';
import 용인 from '../../assets/stamp/용인.png';
import 의왕 from '../../assets/stamp/의왕.png';
import 이천 from '../../assets/stamp/이천.png';
import 평택 from '../../assets/stamp/평택.png';
import 포천 from '../../assets/stamp/포천.png';
import 하남 from '../../assets/stamp/하남.png';
import 화성 from '../../assets/stamp/화성.png';

type StampStatus = 'ACQUIRED' | 'PREVIEW' | 'LOCKED';

interface StampInfo {
  id: number;
  name: string;
  image: string;
}

const REGION_STAMPS: StampInfo[] = [
  { id: 0, name: '광주', image: 광주 },
  { id: 1, name: '김포', image: 김포 },
  { id: 2, name: '시흥', image: 시흥 },
  { id: 3, name: '안성', image: 안성 },
  { id: 4, name: '연천', image: 연천 },
  { id: 5, name: '의정부', image: 의정부 },
  { id: 6, name: '파주', image: 파주 },
  { id: 7, name: '가평', image: 가평 },
  { id: 8, name: '고양', image: 고양 },
  { id: 9, name: '과천', image: 과천 },
  { id: 10, name: '광명', image: 광명 },
  { id: 11, name: '구리', image: 구리 },
  { id: 12, name: '군포', image: 군포 },
  { id: 13, name: '남양주', image: 남양주 },
  { id: 14, name: '동두천', image: 동두천 },
  { id: 15, name: '부천', image: 부천 },
  { id: 16, name: '성남', image: 성남 },
  { id: 17, name: '수원', image: 수원 },
  { id: 18, name: '안산', image: 안산 },
  { id: 19, name: '안양', image: 안양 },
  { id: 20, name: '양주', image: 양주 },
  { id: 21, name: '양평군', image: 양평군 },
  { id: 22, name: '여주', image: 여주 },
  { id: 23, name: '오산', image: 오산 },
  { id: 24, name: '용인', image: 용인 },
  { id: 25, name: '의왕', image: 의왕 },
  { id: 26, name: '이천', image: 이천 },
  { id: 27, name: '평택', image: 평택 },
  { id: 28, name: '포천', image: 포천 },
  { id: 29, name: '하남', image: 하남 },
  { id: 30, name: '화성', image: 화성 },
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

  // 고양(id: 8) 이미지 크기 예외 처리
  const imageSizeClass =
    stamp.id === 8 ? 'w-[48px] h-[68px]' : 'w-[68px] h-[68px]';

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

export default function RegionStampContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'culture' | 'region'>('region');
  const [acquiredIds, setAcquiredIds] = useState<Set<number>>(new Set());
  const [previewIds, setPreviewIds] = useState<Set<number>>(new Set());

  const { data: stampsData, isLoading } = useMyStamps('REGIONAL');

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
      : stampsData.result.REGIONAL || [];

    const newAcquiredIds = new Set<number>();

    stamps.forEach((serverStamp) => {
      const normalizedRegion = extractRegionName(serverStamp.region);

      const foundStamp = REGION_STAMPS.find((localStamp) => {
        const nameNormalized = localStamp.name.trim();
        const regionNormalized = normalizedRegion.trim();

        return (
          nameNormalized === regionNormalized ||
          regionNormalized.includes(nameNormalized) ||
          nameNormalized.includes(regionNormalized) ||
          regionNormalized.replace(/\s/g, '') ===
            nameNormalized.replace(/\s/g, '')
        );
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
          {REGION_STAMPS.map((stamp) => {
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
