// 전체 지도용 지도 뷰
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/map.svg';

import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';

const markers = [
  { id: 1, top: '40%', left: '45%', image: marker1 },
  { id: 2, top: '60%', left: '85%', image: marker2 },
  { id: 3, top: '80%', left: '55%', image: marker3 },
];

interface PublicMapViewProps {
  onMarkerClick: (markerId: number) => void;
}

export default function PublicMapView({ onMarkerClick }: PublicMapViewProps) {
  return (
    <main
      className="flex-1 relative mb-20 cursor-pointer overflow-hidden"
      style={{
        backgroundImage: `url(${mapBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: '0.6s ease-in-out',
      }}
    >
      <img
        src={map}
        alt="지도"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: marker.top, left: marker.left }}
        >
          <img
            src={marker.image}
            className="w-8 h-8 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(marker.id);
            }}
          />
        </div>
      ))}
    </main>
  );
}
