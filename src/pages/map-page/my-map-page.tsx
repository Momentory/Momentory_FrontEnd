import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import MapView, { defaultMarkers } from '../../components/map/MapView';
import BottomSheet from '../../components/map/BottomSheet';

import MapPinIcon from '../../assets/map-pin.svg?react';
import LockIcon from '../../assets/lock-icon.svg?react';
import shareButton from '../../assets/share-button.svg';
import RouletteIcon from '../../assets/roulette.svg?react';

import useMapZoom from '../../hooks/map/useMapZoom';
import useBottomSheet from '../../hooks/map/useBottomSheet';
import { captureMap } from '../../utils/screenshot';
import { dataUrlToFile } from '../../utils/image';
import { uploadFile } from '../../api/S3';

const dropdownItems = [
  { label: '전체 지도', icon: <MapPinIcon />, path: '/publicMap' },
  { label: '내 지도', icon: <LockIcon />, path: '/myMap' },
];

export default function MyMapPage() {
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('고양시');

  // store의 마커와 기본 마커를 병합 (임시로 storeMarkers 무시)
  const markers = useMemo(() => {
    return [...defaultMarkers];
  }, []);

  const {
    zoomed,
    activeMarkerId,
    originPosRef,
    containerRef,
    scale,
    zoomIn: zoomInMarker, // alias 사용
    zoomOut: zoomOutMarker, // alias 사용
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useMapZoom({ markers });

  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();

  const handleShareClick = async () => {
    try {
      setIsCapturing(true);
      const imageDataUrl = await captureMap('map-container');
      const file = await dataUrlToFile(
        imageDataUrl,
        `my-map-${Date.now()}.png`
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
          title="내 지도"
          hasDropdown
          leftIcon={null}
          onLeftClick={undefined}
          dropdownItems={dropdownItems}
          rightAction={
            <div className="relative">
              <button
                className="cursor-pointer relative"
                onClick={() => navigate('/roulette')}
              >
                <RouletteIcon className="w-10 h-10" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-[140px] bg-white text-[#AE8D8D] text-xs font-bold border border-[#FF7070] px-3 py-2 rounded-lg z-50 animate-[fadeIn_0.2s_ease-out] text-center leading-relaxed">
                아직 방문하지 않은
                <br />
                지역이 있다면?
                <br />
                룰렛으로 골라봐요~!
                <div className="absolute -top-2 right-4">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-8 border-b-[#FF7070]"></div>
                  <div className="absolute top-px left-1/2 -translate-x-1/2">
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px] border-b-white"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <MapView
          className={mapHeightClass}
          markers={markers}
          zoomed={zoomed}
          activeMarkerId={activeMarkerId}
          originPosRef={originPosRef}
          containerRef={containerRef}
          scale={scale}
          zoomInMarker={zoomInMarker}
          zoomOutMarker={zoomOutMarker}
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
          isPublic={false}
          regionName={selectedRegion}
        />
      </div>
    </div>
  );
}
