// 지도, 마커 관련 타입 정의
export interface Marker {
  id: number;
  top: string; // ex: '40%'
  left: string; // ex: '55%'
  image: string; // svg asset url
  location?: string; // 지역명 (ex: '성남시 분당구')
  lat?: number; // 위도 (임시 GPS 좌표)
  lng?: number; // 경도 (임시 GPS 좌표)
  color?: string; // 마커 색상 (HEX)
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
  setZoomed: (v: boolean) => void;
  onMarkerClick?: (markerId: number, location?: string) => void;
  setActiveMarkerId: (id: number | null) => void;
}
