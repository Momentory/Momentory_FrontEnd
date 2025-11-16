import { memo, useCallback } from 'react';
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/gyeonggi-map.svg';

import MarkerPopup from './MarkerPopup';
import RegionColorLayer from './RegionColorLayer';
import type { PublicMapViewProps } from '../../types/map';

const BASE_MAP_SCALE = 1.25; // 지도 기본 크기 (살짝 확대)
const MAP_POSITION_X = -30; // 지도 X 위치 (픽셀 단위, 음수면 왼쪽, 양수면 오른쪽)
const MAP_POSITION_Y = -15; // 지도 Y 위치 (픽셀 단위, 음수면 위쪽, 양수면 아래쪽)

const PublicMapView = memo(function PublicMapView({
  markers,
  zoomed,
  activeMarkerId,
  originPosRef,
  containerRef,
  scale,
  isPinching,
  colorMap = {},
  zoomInMarker,
  zoomOutMarker,
  handleWheel,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  onMarkerClick,
  className,
}: PublicMapViewProps) {
  // 지도 위치는 MAP_POSITION_X, MAP_POSITION_Y 상수로 조절
  const position = { x: MAP_POSITION_X, y: MAP_POSITION_Y };

  // 마커 클릭 핸들러 메모이제이션 (성능 최적화)
  const handleMarkerClick = useCallback(
    (id: number, location?: string) => {
      const selectedMarker = markers.find((m) => m.id === id);
      if (selectedMarker) {
        zoomInMarker?.(selectedMarker);
      }
      onMarkerClick?.(id, location);
    },
    [markers, zoomInMarker, onMarkerClick]
  );

  return (
    <main
      id="public-map-container"
      ref={containerRef}
      className={`relative mb-20 cursor-pointer overflow-hidden ${
        className || ''
      }`}
      style={{
        backgroundImage: `url(${mapBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        touchAction: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        zoomOutMarker?.();
      }}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transformOrigin: originPosRef.current
            ? `${originPosRef.current.left} ${originPosRef.current.top}`
            : 'center center',
          transform: `translate(${position.x}px, ${position.y}px) scale(${BASE_MAP_SCALE * scale})`,
          willChange: isPinching ? 'transform' : 'auto',
          transition: isPinching ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        <img
          src={map}
          alt="지도"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* 방문한 지역 색상 오버레이 */}
        <RegionColorLayer colorMap={colorMap} />

        {markers.map((marker, index) => {
          const active = activeMarkerId === marker.id;
          return (
            <MarkerPopup
              key={`public-marker-${marker.id}-${marker.location ?? 'unknown'}-${index}`}
              marker={marker}
              active={active}
              zoomed={zoomed}
              mapScale={scale}
              onMarkerClick={handleMarkerClick}
            />
          );
        })}
      </div>
    </main>
  );
});

export default PublicMapView;
