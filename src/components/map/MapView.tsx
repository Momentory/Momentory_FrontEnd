// 지도 UI 및 마커 렌더링
import type { MapViewProps, Marker, Album } from '../../types/map/map';
import { useRef, useState, useEffect } from 'react';
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/map.svg';

import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';

import p4 from '../../assets/p-4.svg';

import MarkerPopup from './MarkerPopup';

const BASE_MAP_SCALE = 0.85; // 바텀시트 영향 없이 지도만 기본 축소

const markers: Marker[] = [
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

// 💡 [수정 1] 타입에 className?: string 추가
export default function MapView({
  zoomed,
  activeMarkerId,
  originPosRef,
  zoomOutMarker,
  setZoomed,
  setActiveMarkerId,
  onMarkerClick,
  className, // 💡 [수정 2] props로 className 받기
}: MapViewProps & { className?: string }) {
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
    // 트랙패드 핀치 → ctrlKey 가 true인 wheel 이벤트로 전달됨
    if (!e.ctrlKey) return;
    e.preventDefault();

    // 마우스 위치를 기준으로 transform-origin 설정
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const leftPct = ((e.clientX - rect.left) / rect.width) * 100;
      const topPct = ((e.clientY - rect.top) / rect.height) * 100;
      originPosRef.current = { top: `${topPct}%`, left: `${leftPct}%` };
    }

    // 연속 스케일 적용: 자연스러운 곡선으로 감쇠
    const factor = Math.exp(-e.deltaY * 0.002);
    const next = Math.max(1, Math.min(2, scaleRef.current * factor));
    updateZoomState(next);
  };

  // 마커가 있는 지역을 지도에 표시
  useEffect(() => {
    const mapElement = document.querySelector('#map-container img[alt="지도"]');
    if (!mapElement) return;

    // SVG를 직접 로드해서 DOM에 삽입
    fetch(map)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');

        if (svgElement && mapElement.parentElement) {
          // 기존 img를 SVG로 교체
          svgElement.setAttribute('class', mapElement.className);
          svgElement.setAttribute(
            'style',
            mapElement.getAttribute('style') || ''
          );
          mapElement.replaceWith(svgElement);

          // 마커가 있는 지역에 selected 클래스 추가
          markers.forEach((marker) => {
            if (marker.location) {
              // 시/군 이름으로 시작하는 모든 path를 찾아서 칠함 (구 포함)
              const pathElements = svgElement.querySelectorAll(
                `path[id^="${marker.location}"]`
              );
              pathElements.forEach((pathElement) => {
                pathElement.classList.add('selected');
              });
            }
          });
        }
      })
      .catch((err) => console.error('SVG 로드 실패:', err));
  }, []);

  return (
    <main
      id="map-container"
      ref={containerRef}
      // 💡 [수정 3] 'flex-1'을 지우고 전달받은 className으로 교체
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
