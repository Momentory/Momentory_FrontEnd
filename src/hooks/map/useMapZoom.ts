// 지도 확대/축소 및 마커 활성 상태 관리
import { useState, useRef, useCallback } from 'react';
import type { Marker } from '../../types/map';

interface UseMapZoomOptions {
  markers: Marker[];
}

export default function useMapZoom({ markers }: UseMapZoomOptions) {
  const [zoomed, setZoomed] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const originPosRef = useRef<{ top: string; left: string } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const isPinchingRef = useRef(false);
  const scaleRef = useRef(1);
  const pinchBaseScaleRef = useRef(1);
  const [scale, setScale] = useState(1);

  const getDistance = useCallback(
    (
      t1: { clientX: number; clientY: number },
      t2: { clientX: number; clientY: number }
    ) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.hypot(dx, dy);
    },
    []
  );

  const setOriginFromMidpoint = useCallback(
    (
      t1: { clientX: number; clientY: number },
      t2: { clientX: number; clientY: number }
    ) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      const leftPct = ((midX - rect.left) / rect.width) * 100;
      const topPct = ((midY - rect.top) / rect.height) * 100;
      originPosRef.current = { top: `${topPct}%`, left: `${leftPct}%` };
    },
    []
  );

  const pickNearestMarker = useCallback(() => {
    const origin = originPosRef.current;
    if (!origin) return null;
    const ox = parseFloat(origin.left);
    const oy = parseFloat(origin.top);
    let bestId: number | null = null;
    let bestDist = Infinity;
    for (const m of markers) {
      const mx = parseFloat(m.left);
      const my = parseFloat(m.top);
      const dx = mx - ox;
      const dy = my - oy;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist) {
        bestDist = d2;
        bestId = m.id;
      }
    }
    return bestId;
  }, [markers]);

  const updateZoomState = useCallback(
    (nextScale: number) => {
      scaleRef.current = nextScale;
      setScale(nextScale);
      const isZoomed = nextScale > 1.02;
      setZoomed(isZoomed);
      if (isZoomed) {
        const nearest = pickNearestMarker();
        setActiveMarkerId(nearest);
      } else {
        setActiveMarkerId(null);
      }
    },
    [pickNearestMarker]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        isPinchingRef.current = true;
        pinchStartDistRef.current = getDistance(e.touches[0], e.touches[1]);
        pinchBaseScaleRef.current = scaleRef.current;
        setOriginFromMidpoint(e.touches[0], e.touches[1]);
      }
    },
    [getDistance, setOriginFromMidpoint]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPinchingRef.current || e.touches.length !== 2) return;
      e.preventDefault();
      const currentDist = getDistance(e.touches[0], e.touches[1]);
      const startDist = pinchStartDistRef.current || currentDist;
      const ratio = currentDist / startDist;
      const next = Math.max(1, Math.min(2, pinchBaseScaleRef.current * ratio));
      updateZoomState(next);
      setOriginFromMidpoint(e.touches[0], e.touches[1]);
    },
    [getDistance, setOriginFromMidpoint, updateZoomState]
  );

  const handleTouchEnd = useCallback(() => {
    isPinchingRef.current = false;
    pinchStartDistRef.current = null;
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // 트랙패드 핀치
      if (!e.ctrlKey) return;
      e.preventDefault();

      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const leftPct = ((e.clientX - rect.left) / rect.width) * 100;
        const topPct = ((e.clientY - rect.top) / rect.height) * 100;
        originPosRef.current = { top: `${topPct}%`, left: `${leftPct}%` };
      }

      const factor = Math.exp(-e.deltaY * 0.002);
      const next = Math.max(1, Math.min(2, scaleRef.current * factor));
      updateZoomState(next);
    },
    [updateZoomState]
  );

  const zoomIn = useCallback((marker: Marker) => {
    originPosRef.current = { top: marker.top, left: marker.left };
    setZoomed(true);
    setActiveMarkerId(marker.id);
    // 줌인 시 스케일도 업데이트
    const nextScale = 1.5; // 적절한 줌인 스케일 값
    scaleRef.current = nextScale;
    setScale(nextScale);
  }, []);

  const zoomOut = useCallback(() => {
    setZoomed(false);
    setActiveMarkerId(null);
    scaleRef.current = 1;
    setScale(1);
    setTimeout(() => (originPosRef.current = null), 600);
  }, []);

  return {
    zoomed,
    setZoomed,
    activeMarkerId,
    setActiveMarkerId,
    originPosRef,
    containerRef,
    scale,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    zoomIn,
    zoomOut,
  };
}
