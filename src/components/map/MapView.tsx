// 지도 UI 및 마커 렌더링
import type { MapViewProps, Marker, Album } from '../../types/map/map';
import { useRef, useState, useEffect, useMemo } from 'react';
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/map.svg';

import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';

import p4 from '../../assets/p-4.svg';

import MarkerPopup from './MarkerPopup';
import { useMarkerStore } from '../../stores/markerStore';

const BASE_MAP_SCALE = 0.85; // 바텀시트 영향 없이 지도만 기본 축소

// 기본 마커 (기존 데이터)
const defaultMarkers: Marker[] = [
  {
    id: 1,
    top: '30%',
    left: '40%',
    image: marker1,
    location: '양주시',
    lat: 37.7854,
    lng: 127.0458,
  },
  {
    id: 2,
    top: '68%',
    left: '77%',
    image: marker2,
    location: '여주시',
    lat: 37.2978,
    lng: 127.6374,
  },
  {
    id: 3,
    top: '75%',
    left: '30%',
    image: marker3,
    location: '화성시',
    lat: 37.1992,
    lng: 126.8312,
  },
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
  zoomOutMarker,
  setZoomed,
  setActiveMarkerId,
  onMarkerClick,
  className,
}: MapViewProps & { className?: string }) {
  const storeMarkers = useMarkerStore((state) => state.markers);
  const svgElementRef = useRef<SVGElement | null>(null);

  // store의 마커와 기본 마커를 병합 (같은 location이면 store 마커 우선)
  const markers = useMemo(() => {
    const merged = [...defaultMarkers];
    storeMarkers.forEach((storeMarker) => {
      const existingIndex = merged.findIndex(
        (m) => m.location === storeMarker.location
      );
      if (existingIndex >= 0) {
        merged[existingIndex] = { ...merged[existingIndex], ...storeMarker };
      } else {
        merged.push(storeMarker);
      }
    });
    return merged;
  }, [storeMarkers]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const isPinchingRef = useRef(false);
  const scaleRef = useRef(1);
  const pinchBaseScaleRef = useRef(1);
  const [scale, setScale] = useState(1);

  const pickNearestMarker = () => {
    // origin 기준(%)과 마커(%) 거리 비교 후 가장 가까운 마커 id 반환
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
  };

  const updateZoomState = (nextScale: number) => {
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
  };

  const getDistance = (
    t1: { clientX: number; clientY: number },
    t2: { clientX: number; clientY: number }
  ) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  };

  const setOriginFromMidpoint = (
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
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinchingRef.current = true;
      pinchStartDistRef.current = getDistance(e.touches[0], e.touches[1]);
      pinchBaseScaleRef.current = scaleRef.current;
      setOriginFromMidpoint(e.touches[0], e.touches[1]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPinchingRef.current || e.touches.length !== 2) return;
    e.preventDefault();
    const currentDist = getDistance(e.touches[0], e.touches[1]);
    const startDist = pinchStartDistRef.current || currentDist;
    const ratio = currentDist / startDist;
    const next = Math.max(1, Math.min(2, pinchBaseScaleRef.current * ratio));
    updateZoomState(next);
    setOriginFromMidpoint(e.touches[0], e.touches[1]);
  };

  const handleTouchEnd = () => {
    isPinchingRef.current = false;
    pinchStartDistRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
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
  };

  // 마커가 있는 지역을 지도에 표시 (마커 색상으로 강조)
  useEffect(() => {
    const mapElement = document.querySelector('#map-container img[alt="지도"]');
    if (!mapElement) return;

    // SVG가 이미 로드되었으면 색상만 업데이트
    if (svgElementRef.current) {
      // 모든 path를 원래 색상으로 초기화 (이전 색상 제거)
      const allPaths = svgElementRef.current.querySelectorAll('path');
      allPaths.forEach((path) => {
        const originalFill = path.getAttribute('data-original-fill');
        if (originalFill) {
          path.setAttribute('fill', originalFill);
          path.removeAttribute('opacity');
        }
      });

      // 마커 색상 적용
      markers.forEach((marker) => {
        if (marker.location && marker.color) {
          const pathElements = svgElementRef.current!.querySelectorAll(
            `path[id^="${marker.location}"]`
          );
          pathElements.forEach((pathElement) => {
            const originalFill = pathElement.getAttribute('fill');
            if (originalFill && originalFill !== 'none') {
              // 원본 색상 저장 (없을 경우에만)
              if (!pathElement.getAttribute('data-original-fill')) {
                pathElement.setAttribute('data-original-fill', originalFill);
              }
              pathElement.setAttribute('fill', marker.color!);
              pathElement.setAttribute('opacity', '0.5');
            }
          });
        }
      });
      return;
    }

    // 첫 로드 시 SVG 파싱 및 적용
    fetch(map)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');

        if (svgElement && mapElement.parentElement) {
          svgElement.setAttribute('class', mapElement.className);
          svgElement.setAttribute(
            'style',
            mapElement.getAttribute('style') || ''
          );
          mapElement.replaceWith(svgElement);
          svgElementRef.current = svgElement;

          markers.forEach((marker) => {
            if (marker.location) {
              // 시/군 이름으로 시작하는 모든 path를 찾아서 칠함 (구 포함)
              const pathElements = svgElement.querySelectorAll(
                `path[id^="${marker.location}"]`
              );
              pathElements.forEach((pathElement) => {
                pathElement.classList.add('selected');
                // 원본 색상 저장
                const originalFill = pathElement.getAttribute('fill');
                if (originalFill && originalFill !== 'none') {
                  pathElement.setAttribute('data-original-fill', originalFill);
                  // 마커 색상이 있으면 적용
                  if (marker.color) {
                    pathElement.setAttribute('fill', marker.color);
                    pathElement.setAttribute('opacity', '0.5');
                  }
                }
              });
            }
          });
        }
      })
      .catch((err) => console.error('SVG 로드 실패:', err));
  }, [markers]);

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
          transform: `scale(${BASE_MAP_SCALE * scale})`,
        }}
      >
        <img
          src={map}
          alt="지도"
          className="absolute inset-0 w-full h-full object-contain"
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
              onMarkerClick={onMarkerClick}
              isPublic={false}
            />
          );
        })}
      </div>
    </main>
  );
}
