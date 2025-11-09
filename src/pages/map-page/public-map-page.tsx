import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import PublicMapView from '../../components/map/PublicMapView';
import BottomSheet from '../../components/map/BottomSheet';

import MapPinIcon from '../../assets/map-pin.svg?react';
import LockIcon from '../../assets/lock-icon.svg?react';
import shareButton from '../../assets/share-button.svg';

import useMapZoom from '../../hooks/map/useMapZoom';
import useBottomSheet from '../../hooks/map/useBottomSheet';
import { captureMap } from '../../utils/screenshot';
import { dataUrlToFile } from '../../utils/image';
import { uploadFile } from '../../api/S3';
import type { Marker } from '../../types/map';

const dropdownItems = [
  { label: '전체 지도', icon: <MapPinIcon />, path: '/publicMap' },
  { label: '내 지도', icon: <LockIcon />, path: '/myMap' },
];

export default function PublicMapPage() {
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('고양시');
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();

  // PublicMapView는 현재 마커가 없음
  const markers = useMemo<Marker[]>(() => [], []);

  const {
    zoomed,
    activeMarkerId,
    originPosRef,
    containerRef,
    scale,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useMapZoom({ markers });

  const handleShareClick = async () => {
    try {
      setIsCapturing(true);
      const imageDataUrl = await captureMap('public-map-container');
      const file = await dataUrlToFile(
        imageDataUrl,
        `public-map-${Date.now()}.png`
      );
      const uploadResponse = await uploadFile(file);
      navigate('/share', {
        state: {
          imageUrl: uploadResponse.result.imageUrl,
          previewImage: imageDataUrl,
          imageName: uploadResponse.result.imageName,
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
          title="전체 지도"
          hasDropdown
          dropdownItems={dropdownItems}
        />

        <PublicMapView
          className={mapHeightClass}
          markers={markers}
          zoomed={zoomed}
          activeMarkerId={activeMarkerId}
          originPosRef={originPosRef}
          containerRef={containerRef}
          scale={scale}
          handleWheel={handleWheel}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
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
          isPublic={true}
          regionName={selectedRegion}
        />
      </div>
    </div>
  );
}
