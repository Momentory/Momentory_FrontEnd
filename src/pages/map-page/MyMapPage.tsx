import { useState, useRef } from 'react';
import MapView from '../../components/map/MapView';
import BottomSheet from '../../components/map/BottomSheet';
import DropdownHeader from '../../components/common/DropdownHeader';
import MapPinIcon from '../../assets/map-pin.svg?react';
import LockIcon from '../../assets/lock-icon.svg?react';
import shareButton from '../../assets/share-button.svg';

const dropdownItems = [
  { label: '전체 지도', icon: <MapPinIcon />, path: '/publicMap' },
  { label: '내 지도', icon: <LockIcon />, path: '/myMap' },
];

export default function MyMapPage() {
  // 지도 확대/축소 상태
  const [zoomed, setZoomed] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

  // 하단 시트 상태
  const [bottomSheetHeight, setBottomSheetHeight] = useState(90);
  const [isExpanded, setIsExpanded] = useState(false);

  // 마커 클릭 시 transformOrigin
  const originPosRef = useRef<{ top: string; left: string } | null>(null);

  const share = () => console.log('공유 클릭');

  return (
    <div className="relative h-full flex justify-center items-center bg-gray-50 font-Pretendard">
      <div className="relative max-w-[480px] w-full h-full bg-white shadow-lg overflow-hidden flex flex-col">
        <DropdownHeader
          title="내 지도"
          hasDropdown
          dropdownItems={dropdownItems}
        />

        <MapView
          zoomed={zoomed}
          setZoomed={setZoomed}
          activeMarkerId={activeMarkerId}
          setActiveMarkerId={setActiveMarkerId}
          originPosRef={originPosRef}
        />

        <button
          onClick={share}
          className="absolute right-4 w-14 h-14 shadow-lg z-20 transition-all duration-300"
          style={{ bottom: `${bottomSheetHeight + 16}px` }}
        >
          <img src={shareButton} />
        </button>

        <BottomSheet
          height={bottomSheetHeight}
          setHeight={setBottomSheetHeight}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
    </div>
  );
}

