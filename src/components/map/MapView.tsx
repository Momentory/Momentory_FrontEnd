// 지도 UI 및 마커 렌더링
import type { MapViewProps, Marker, Album } from '../../types/map';
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/gyeonggi-map.svg';

import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';

import p4 from '../../assets/p-4.svg';

import MarkerPopup from './MarkerPopup';
import { gpsToMapPosition } from '../../utils/mapCoordinates';

const BASE_MAP_SCALE = 1.1; // 지도 기본 크기
const MAP_POSITION_X = -30; // 지도 X 위치 (픽셀 단위, 음수면 왼쪽, 양수면 오른쪽)
const MAP_POSITION_Y = -15; // 지도 Y 위치 (픽셀 단위, 음수면 위쪽, 양수면 아래쪽)

// 기본 마커 (기존 데이터) - 테스트용 마커들
// GPS 좌표를 지도 위치로 변환 (부천시 기준으로 보정된 함수 사용)
const bucheonPosition = gpsToMapPosition(37.5034, 126.766);
const hwaseongPosition = gpsToMapPosition(37.1995, 126.8319);
const gapyeongPosition = gpsToMapPosition(37.8315, 127.5093);
const seongnamPosition = gpsToMapPosition(37.42, 127.1265);
const yeoncheonPosition = gpsToMapPosition(38.033884, 127.071054);
const anseongPosition = gpsToMapPosition(37.01, 127.27);
const yonginPosition = gpsToMapPosition(37.2411, 127.1776);
const namyangjuPosition = gpsToMapPosition(37.6367, 127.2165);
const pyeongtaekPosition = gpsToMapPosition(36.992, 127.1127);
const dongducheonPosition = gpsToMapPosition(37.892406, 127.052184);
const defaultMarkers: Marker[] = [
  {
    id: 1,
    top: bucheonPosition.top,
    left: bucheonPosition.left,
    image: marker1,
    location: '부천시',
    lat: 37.5034,
    lng: 126.766,
    color: '#FF7070',
  },
  {
    id: 2,
    top: hwaseongPosition.top,
    left: hwaseongPosition.left,
    image: marker2,
    location: '화성시',
    lat: 37.1995,
    lng: 126.8319,
    color: '#70FF70',
  },
  {
    id: 3,
    top: gapyeongPosition.top, // 개선된 보정 함수가 자동으로 보정
    left: gapyeongPosition.left, // 개선된 보정 함수가 자동으로 보정
    image: marker3,
    location: '가평군',
    lat: 37.8315,
    lng: 127.5093,
    color: '#7070FF',
  },
  {
    id: 4,
    top: seongnamPosition.top, // 개선된 보정 함수가 자동으로 보정
    left: seongnamPosition.left, // 개선된 보정 함수가 자동으로 보정
    image: marker1,
    location: '성남시',
    lat: 37.42,
    lng: 127.1265,
    color: '#FFB870',
  },
  {
    id: 5,
    top: yeoncheonPosition.top, // 개선된 보정 함수가 자동으로 보정
    left: yeoncheonPosition.left, // 개선된 보정 함수가 자동으로 보정
    image: marker2,
    location: '연천군',
    lat: 38.033884,
    lng: 127.071054,
    color: '#B870FF',
  },
  {
    id: 6,
    top: anseongPosition.top, // 개선된 보정 함수가 자동으로 보정
    left: anseongPosition.left, // 개선된 보정 함수가 자동으로 보정
    image: marker3,
    location: '안성시',
    lat: 37.01,
    lng: 127.27,
    color: '#FF70B8',
  },
  {
    id: 7,
    top: yonginPosition.top, // 개선된 보정 함수가 자동으로 보정
    left: yonginPosition.left, // 개선된 보정 함수가 자동으로 보정
    image: marker1,
    location: '용인시',
    lat: 37.2411,
    lng: 127.1776,
    color: '#70B8FF',
  },
  {
    id: 8,
    top: namyangjuPosition.top, // 개선된 보정 함수가 자동으로 보정
    left: namyangjuPosition.left, // 개선된 보정 함수가 자동으로 보정
    image: marker2,
    location: '남양주시',
    lat: 37.6367,
    lng: 127.2165,
    color: '#FFFF70',
  },
  {
    id: 9,
    top: pyeongtaekPosition.top, // 개선된 보정 함수가 자동으로 보정
    left: pyeongtaekPosition.left, // 개선된 보정 함수가 자동으로 보정
    image: marker3,
    location: '평택시',
    lat: 36.992,
    lng: 127.1127,
    color: '#B8FF70',
  },
  {
    id: 10,
    top: dongducheonPosition.top,
    left: dongducheonPosition.left,
    image: marker1,
    location: '동두천시',
    lat: 37.892406,
    lng: 127.052184,
    color: '#FF70FF',
  },
];

const markerAlbums: Album[] = [
  { id: 1, imageUrl: p4, title: '1 나의 앨범 페이지로 이동' },
  { id: 2, imageUrl: p4, title: '2 나의 앨범 페이지로 이동' },
  { id: 3, imageUrl: p4, title: '3 나의 앨범 페이지로 이동' },
];

// defaultMarkers를 export하여 외부에서 사용할 수 있도록 함
export { defaultMarkers };

export default function MapView({
  markers,
  zoomed,
  activeMarkerId,
  originPosRef,
  containerRef,
  scale,
  zoomOutMarker,
  handleWheel,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  onMarkerClick,
  className,
}: MapViewProps) {
  // 지도 위치는 MAP_POSITION_X, MAP_POSITION_Y 상수로 조절
  const position = { x: MAP_POSITION_X, y: MAP_POSITION_Y };

  return (
    <main
      id="map-container"
      ref={containerRef}
      className={`relative mb-20 cursor-pointer ${className || ''}`}
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
      onClick={zoomOutMarker}
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
              key={`marker-${marker.id}-${marker.location}-${index}`}
              marker={marker}
              active={active}
              album={album}
              zoomed={zoomed}
              onMarkerClick={onMarkerClick}
            />
          );
        })}
      </div>
    </main>
  );
}
