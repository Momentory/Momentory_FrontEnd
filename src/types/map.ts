// 지도, 마커 관련 타입 정의
export interface MapPhoto {
  photoId: number;
  imageName: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  memo: string;
  visibility: string;
  createdAt: string;
}

export type RegionColorMap = Record<string, string>;
export type RegionPhotoMap = Record<string, MapPhoto>;

export interface Marker {
  id: number;
  top: string; // ex: '40%'
  left: string; // ex: '55%'
  image?: string; // svg asset url
  location?: string; // 지역명 (ex: '성남시 분당구')
  lat?: number; // 위도 (임시 GPS 좌표)
  lng?: number; // 경도 (임시 GPS 좌표)
  color?: string; // 마커 색상 (HEX)
  photo?: MapPhoto | null;
}

export interface MapViewProps {
  markers: Marker[];
  zoomed: boolean;
  activeMarkerId: number | null;
  originPosRef: React.MutableRefObject<{ top: string; left: string } | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  isPinching: boolean;
  colorMap?: Record<string, string>; // 지역별 색상 맵
  zoomInMarker: (marker: Marker) => void;
  zoomOutMarker: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  onMarkerClick?: (markerId: number, location?: string) => void;
  className?: string;
}

export interface PublicMapViewProps {
  markers: Marker[];
  zoomed: boolean;
  activeMarkerId: number | null;
  originPosRef: React.MutableRefObject<{ top: string; left: string } | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  isPinching: boolean;
  colorMap?: Record<string, string>; // 지역별 색상 맵
  zoomInMarker?: (marker: Marker) => void;
  zoomOutMarker?: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  onMarkerClick?: (markerId: number, location?: string) => void;
  className?: string;
}
