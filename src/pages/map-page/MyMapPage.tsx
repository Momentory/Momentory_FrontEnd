import DropdownHeader from '../../components/common/DropdownHeader';
import MapView from '../../components/map/MapView';
import BottomSheet from '../../components/map/BottomSheet';

import MapPinIcon from '../../assets/map-pin.svg?react';
import LockIcon from '../../assets/lock-icon.svg?react';
import shareButton from '../../assets/share-button.svg';

import useMapZoom from '../../hooks/map/useMapZoom';
import useBottomSheet from '../../hooks/map/useBottomSheet';

const dropdownItems = [
  { label: '전체 지도', icon: <MapPinIcon />, path: '/publicMap' },
  { label: '내 지도', icon: <LockIcon />, path: '/myMap' },
];

export default function MyMapPage() {
  const {
    zoomed,
    activeMarkerId,
    originPosRef,
    zoomIn: zoomInMarker, // alias 사용
    zoomOut: zoomOutMarker, // alias 사용
  } = useMapZoom();

  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();

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
          activeMarkerId={activeMarkerId}
          originPosRef={originPosRef}
          zoomInMarker={zoomInMarker}
          zoomOutMarker={zoomOutMarker}
        />

        <button
          onClick={() => console.log('공유 클릭')}
          className="absolute right-4 w-14 h-14 shadow-lg z-20 transition-all duration-300"
          style={{ bottom: `${height + 16}px` }}
        >
          <img src={shareButton} />
        </button>

        <BottomSheet
          height={height}
          setHeight={setHeight}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
    </div>
  );
}
