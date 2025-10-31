import { useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import PublicMapView from '../../components/map/PublicMapView';
import BottomSheet from '../../components/map/BottomSheet';

import MapPinIcon from '../../assets/map-pin.svg?react';
import LockIcon from '../../assets/lock-icon.svg?react';
import shareButton from '../../assets/share-button.svg';

import useBottomSheet from '../../hooks/map/useBottomSheet';

const dropdownItems = [
  { label: '전체 지도', icon: <MapPinIcon />, path: '/publicMap' },
  { label: '내 지도', icon: <LockIcon />, path: '/myMap' },
];

export default function PublicMapPage() {
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();
  const [selectedRegion, setSelectedRegion] = useState<string>('고양시');

  // BottomSheet가 헤더를 덮지 않도록 최대 높이 계산 (헤더 112px + 여백 20px)
  const totalHeaderHeight = 112;
  const topGap = 20;
  const maxHeight = window.innerHeight - totalHeaderHeight - topGap;

  // 최대 높이에 도달하면 공유 버튼 숨김 (약간의 오차 범위 -10)
  const isAtMaxHeight = height >= maxHeight - 10;
  const showShareButton = !isAtMaxHeight;

  // 지도 컴포넌트 높이 계산 (헤더 112px + 네비 56px = 172px)
  const mapHeightClass = 'h-[calc(100vh-172px)]';

  return (
    <div className="relative flex justify-center items-center bg-gray-50 font-Pretendard">
      <div className="relative max-w-[480px] w-full bg-white shadow-lg overflow-hidden flex flex-col">
        <DropdownHeader
          title="전체 지도"
          hasDropdown
          dropdownItems={dropdownItems}
        />

        <PublicMapView
          className={mapHeightClass}
          onMarkerClick={(markerId, location) => {
            setIsExpanded(false);
            setHeight(516);
            if (location) {
              setSelectedRegion(location);
            }
          }}
        />

        {showShareButton && (
          <button
            onClick={() => console.log('공유 클릭')}
            className="absolute right-4 w-14 h-14 shadow-lg z-40 transition-all duration-300"
            style={{ bottom: `${height + 16}px` }}
          >
            <img src={shareButton} />
          </button>
        )}

        <BottomSheet
          height={height}
          setHeight={setHeight}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isPublic={true}
          regionName={selectedRegion}
        />
      </div>
    </div>
  );
}
