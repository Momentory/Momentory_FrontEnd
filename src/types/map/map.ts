// 지도, 마커 관련 타입 정의
export interface Marker {
  id: number;
  top: string; // ex: '40%'
  left: string; // ex: '55%'
  image: string; // svg asset url
}

export interface Album {
  id: number;
  imageUrl: string;
  title: string;
}

export interface MapViewProps {
  zoomed: boolean;
  activeMarkerId: number | null;
  originPosRef: React.MutableRefObject<{ top: string; left: string } | null>;
  zoomInMarker: (marker: Marker) => void;
  zoomOutMarker: () => void;
}
