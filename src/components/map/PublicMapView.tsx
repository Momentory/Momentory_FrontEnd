import mapBack from '../../assets/map-back.svg';
import map from '../../assets/gyeonggi-map.svg';

import MarkerPopup from './MarkerPopup';
import type { PublicMapViewProps } from '../../types/map';

const BASE_MAP_SCALE = 1.1; // 지도 기본 크기
const MAP_POSITION_X = -30; // 지도 X 위치 (픽셀 단위, 음수면 왼쪽, 양수면 오른쪽)
const MAP_POSITION_Y = -15; // 지도 Y 위치 (픽셀 단위, 음수면 위쪽, 양수면 아래쪽)

const markerAlbums: Array<{ id: number; imageUrl: string; title: string }> = [];

export default function PublicMapView({
  markers,
  zoomed,
  activeMarkerId,
  originPosRef,
  containerRef,
  scale,
  handleWheel,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  onMarkerClick,
  className,
}: PublicMapViewProps) {
  // 지도 위치는 MAP_POSITION_X, MAP_POSITION_Y 상수로 조절
  const position = { x: MAP_POSITION_X, y: MAP_POSITION_Y };

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
        transition: '0.6s ease-in-out',
        touchAction: 'none',
      }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-600"
        style={{
          transformOrigin: originPosRef.current
            ? `${originPosRef.current.left} ${originPosRef.current.top}`
            : 'center center',
          transform: `translate(${position.x}px, ${position.y}px) scale(${BASE_MAP_SCALE * scale})`,
        }}
      >
        <img
          src={map}
          alt="지도"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {markers.map((marker, index) => {
          const active = activeMarkerId === marker.id;
          const album = markerAlbums.find((a) => a.id === marker.id);
          return (
            <MarkerPopup
              key={`public-marker-${marker.id}-${marker.location}-${index}`}
              marker={marker}
              active={active}
              album={album}
              zoomed={zoomed}
              onMarkerClick={(id, location) => onMarkerClick?.(id, location)}
            />
          );
        })}
      </div>
    </main>
  );
}
