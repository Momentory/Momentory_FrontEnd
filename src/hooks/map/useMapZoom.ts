// 지도 확대/축소 및 마커 활성 상태 관리
import { useState, useRef } from 'react';
import type { Marker } from '../../types/map/map';

export default function useMapZoom() {
  const [zoomed, setZoomed] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const originPosRef = useRef<{ top: string; left: string } | null>(null);

  const zoomIn = (marker: Marker) => {
    originPosRef.current = { top: marker.top, left: marker.left };
    setZoomed(true);
    setActiveMarkerId(marker.id);
  };

  const zoomOut = () => {
    setZoomed(false);
    setActiveMarkerId(null);
    setTimeout(() => (originPosRef.current = null), 600);
  };

  return {
    zoomed,
    setZoomed,
    activeMarkerId,
    setActiveMarkerId,
    originPosRef,
    zoomIn,
    zoomOut,
  };
}
