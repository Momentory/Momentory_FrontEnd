import { useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import PublicMapView from '../../components/map/PublicMapView';
import PublicBottomSheet from '../../components/map/PublicBottomSheet';

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
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  const handleMarkerClick = (markerId: number) => {
    setSelectedMarkerId(markerId);
    setIsExpanded(true);
    setHeight(460);
  };

  const maxHeight =
    typeof window !== 'undefined' ? window.innerHeight * 0.9 : 600;
  const isAtMaxHeight = height >= maxHeight - 10;
  const showShareButton = !isAtMaxHeight;

  return (
    <div className="relative h-full flex justify-center items-center bg-gray-50 font-Pretendard">
      <div className="relative max-w-[480px] w-full h-full bg-white shadow-lg overflow-hidden flex flex-col">
        <DropdownHeader
          title="전체 지도"
          hasDropdown
          dropdownItems={dropdownItems}
        />

        <PublicMapView onMarkerClick={handleMarkerClick} />

        {/* 공유 버튼: 하단시트가 끝까지 올라갔을 때만 숨김 */}
        {showShareButton && (
          <button
            onClick={() => console.log('공유 클릭')}
            className="absolute right-4 w-14 h-14 shadow-lg z-40 transition-all duration-300"
            style={{ bottom: `${height + 16}px` }}
          >
            <img src={shareButton} />
          </button>
        )}

        {/* 하단 시트 */}
        <PublicBottomSheet
          height={height}
          setHeight={setHeight}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          selectedMarkerId={selectedMarkerId}
        />
      </div>
    </div>
  );
}
