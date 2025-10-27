// 지도 UI 및 마커 렌더링
import type { MapViewProps, Marker, Album } from '../../types/map/map';
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/map.svg';

import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';

import p4 from '../../assets/p-4.svg';

import MarkerPopup from './MarkerPopup';

const markers: Marker[] = [
  { id: 1, top: '40%', left: '45%', image: marker1 },
  { id: 2, top: '60%', left: '85%', image: marker2 },
  { id: 3, top: '80%', left: '55%', image: marker3 },
];

const markerAlbums: Album[] = [
  { id: 1, imageUrl: p4, title: '1 나의 앨범 페이지로 이동' },
  { id: 2, imageUrl: p4, title: '2 나의 앨범 페이지로 이동' },
  { id: 3, imageUrl: p4, title: '3 나의 앨범 페이지로 이동' },
];

export default function MapView({
  zoomed,
  activeMarkerId,
  originPosRef,
  zoomInMarker,
  zoomOutMarker,
}: MapViewProps) {
  return (
    <main
      className="flex-1 relative mb-20 cursor-pointer overflow-hidden"
      style={{
        backgroundImage: `url(${mapBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: '0.6s ease-in-out',
      }}
      onClick={zoomOutMarker}
    >
      <img
        src={map}
        alt="지도"
        className={`absolute inset-0 w-full h-full object-contain transition-transform duration-600 ${
          zoomed ? 'scale-200' : 'scale-100'
        }`}
        style={{
          transformOrigin: originPosRef.current
            ? `${originPosRef.current.left} ${originPosRef.current.top}`
            : 'center center',
        }}
      />

      {markers.map((marker) => {
        const active = activeMarkerId === marker.id;
        const album = markerAlbums.find((a) => a.id === marker.id);
        return (
          <MarkerPopup
            key={marker.id}
            marker={marker}
            active={active}
            album={album}
            zoomed={zoomed}
            zoomIn={zoomInMarker}
          />
        );
      })}
    </main>
  );
}
