import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import PublicMapView from '../../components/map/PublicMapView';
import BottomSheet from '../../components/map/BottomSheet';

import MapPinIcon from '../../assets/map-pin.svg?react';
import LockIcon from '../../assets/lock-icon.svg?react';
import shareButton from '../../assets/share-button.svg';
import RouletteIcon from '../../assets/roulette.svg?react';
import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';

import useMapZoom from '../../hooks/map/useMapZoom';
import useBottomSheet from '../../hooks/map/useBottomSheet';
import { captureMap } from '../../utils/screenshot';
import { dataUrlToFile } from '../../utils/image';
import { uploadFile } from '../../api/S3';
import type { Marker } from '../../types/map';
import { getRegionMapPosition, REGION_REPRESENTATIVE_COORDS } from '../../utils/mapCoordinates';
import { usePublicMapLatestPhotos } from '../../hooks/map/useMap';

const dropdownItems = [
  { label: '전체 지도', icon: <MapPinIcon />, path: '/publicMap' },
  { label: '내 지도', icon: <LockIcon />, path: '/myMap' },
];

export default function PublicMapPage() {
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const { height, isExpanded, setHeight, setIsExpanded } = useBottomSheet();

  const {
    data: latestPhotos,
    isLoading: isLoadingMarkers,
    isError: isMarkerError,
  } = usePublicMapLatestPhotos();

  const markerIcons = useMemo(() => [marker1, marker2, marker3], []);

  const markers = useMemo<Marker[]>(() => {
    if (!latestPhotos) return [];

    return Object.entries(latestPhotos).reduce<Marker[]>(
      (acc, [regionName, photo], index) => {
        if (!photo) return acc;

        // 지역명으로 지도 상의 정확한 위치 가져오기
        const position = getRegionMapPosition(regionName);

        if (!position) {
          console.warn(`${regionName}의 지도 위치를 찾을 수 없습니다.`);
          return acc;
        }

        // GPS 좌표는 대표 좌표 사용 (백엔드 통신용)
        const coords = REGION_REPRESENTATIVE_COORDS[regionName];
        const icon = markerIcons[index % markerIcons.length];

        acc.push({
          id: photo.photoId || index + 1,
          top: position.top,
          left: position.left,
          image: icon,
          location: regionName,
          lat: coords?.lat || 37.5,
          lng: coords?.lng || 127.0,
          color: '#FF7070',
          photo,
        });

        return acc;
      },
      []
    );
  }, [latestPhotos, markerIcons]);

  const {
    zoomed,
    activeMarkerId,
    originPosRef,
    containerRef,
    scale,
    isPinching,
    zoomIn: zoomInMarker,
    zoomOut: zoomOutMarker,
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

  const mapHeightClass = 'h-[calc(100vh-140px)]';

  useEffect(() => {
    if (!selectedRegion && markers.length > 0) {
      setSelectedRegion(markers[0].location ?? '');
    } else if (
      selectedRegion &&
      markers.length > 0 &&
      !markers.some((marker) => marker.location === selectedRegion)
    ) {
      setSelectedRegion(markers[0].location ?? '');
    }
  }, [markers, selectedRegion]);

  return (
    <div className="relative flex justify-center items-center bg-gray-50 font-Pretendard">
      <div className="relative max-w-[480px] w-full bg-white shadow-lg overflow-hidden flex flex-col">
        <DropdownHeader
          title="전체 지도"
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
              <div className="absolute right-0 top-full mt-2 w-[140px] bg-white text-[#AE8D8D] text-xs font-bold border border-[#FF7070] px-3 py-2 rounded-lg z-30 animate-[fadeIn_0.2s_ease-out] text-center leading-relaxed">
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

        <PublicMapView
          className={mapHeightClass}
          markers={markers}
          zoomed={zoomed}
          activeMarkerId={activeMarkerId}
          originPosRef={originPosRef}
          containerRef={containerRef}
          scale={scale}
          isPinching={isPinching}
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

        {(isLoadingMarkers || isMarkerError) && (
          <div className="absolute inset-x-0 top-[160px] z-30 mx-auto w-[360px] rounded-xl bg-black/60 px-4 py-3 text-center text-sm text-white backdrop-blur">
            {isLoadingMarkers
              ? '공개 사진 정보를 불러오는 중입니다...'
              : '공개 사진 정보를 불러오지 못했어요.'}
          </div>
        )}

        <button
          onClick={handleShareClick}
          disabled={isCapturing}
          className={`absolute right-4 w-14 h-14 shadow-lg z-20 transition-all duration-300 ${
            isCapturing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
          style={{ bottom: `${height + 16 + 80}px` }}
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
          recentPhoto={
            selectedRegion ? (latestPhotos?.[selectedRegion] ?? null) : null
          }
        />
      </div>
    </div>
  );
}
