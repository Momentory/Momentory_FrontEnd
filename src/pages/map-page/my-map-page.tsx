import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import MapView from '../../components/map/MapView';
import BottomSheet from '../../components/map/BottomSheet';

import MapPinIcon from '../../assets/map-pin.svg?react';
import LockIcon from '../../assets/lock-icon.svg?react';
import shareButton from '../../assets/share-button.svg';

import useMapZoom from '../../hooks/map/useMapZoom';
import useBottomSheet from '../../hooks/map/useBottomSheet';
import { captureMap } from '../../utils/screenshot';

const dropdownItems = [
  { label: '전체 지도', icon: <MapPinIcon />, path: '/publicMap' },
  { label: '내 지도', icon: <LockIcon />, path: '/myMap' },
];

export default function MyMapPage() {
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('고양시');

  const {
    zoomed,
    activeMarkerId,
    originPosRef,
    zoomIn: zoomInMarker, // alias 사용
    zoomOut: zoomOutMarker, // alias 사용
    setZoomed,
    setActiveMarkerId,
  } = useMapZoom();

  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();

  const handleShareClick = async () => {
    try {
      setIsCapturing(true);
      const imageDataUrl = await captureMap('map-container');
      navigate('/share', {
        state: {
          imageUrl: imageDataUrl,
          type: 'captured',
        },
      });
    } catch (error) {
      console.error('지도 캡처 실패:', error);
      alert('지도 캡처에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCapturing(false);
    }
  };

  const mapHeightClass = 'h-[calc(100vh-172px)]';

  return (
    <div className="relative flex justify-center items-center bg-gray-50 font-Pretendard">
      <div className="relative max-w-[480px] w-full bg-white shadow-lg overflow-hidden flex flex-col">
        <DropdownHeader
          title="내 지도"
          hasDropdown
          dropdownItems={dropdownItems}
        />

        <MapView
          className={mapHeightClass}
          zoomed={zoomed}
          activeMarkerId={activeMarkerId}
          originPosRef={originPosRef}
          zoomInMarker={zoomInMarker}
          zoomOutMarker={zoomOutMarker}
          setZoomed={setZoomed}
          setActiveMarkerId={setActiveMarkerId}
          onMarkerClick={(_markerId, location) => {
            setIsExpanded(false);
            setHeight(516);
            if (location) {
              setSelectedRegion(location);
            }
          }}
        />

        <button
          onClick={handleShareClick}
          disabled={isCapturing}
          className={`absolute right-4 w-14 h-14 shadow-lg z-20 transition-all duration-300 ${
            isCapturing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
          style={{ bottom: `${height + 16}px` }}
        >
          <img src={shareButton} alt="공유" />
        </button>

        <BottomSheet
          height={height}
          setHeight={setHeight}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isPublic={false}
          regionName={selectedRegion}
        />
      </div>
    </div>
  );
}
