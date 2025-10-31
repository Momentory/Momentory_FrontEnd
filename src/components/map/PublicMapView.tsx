import { useRef, useState, useEffect } from 'react';
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/map.svg';

import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';
import p4 from '../../assets/p-4.svg';
import MarkerPopup from './MarkerPopup';

const BASE_MAP_SCALE = 0.85;

const markers = [
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

const markerAlbums = [
  { id: 1, imageUrl: p4, title: '1 공개 앨범으로 이동' },
  { id: 2, imageUrl: p4, title: '2 공개 앨범으로 이동' },
  { id: 3, imageUrl: p4, title: '3 공개 앨범으로 이동' },
];

interface PublicMapViewProps {
  onMarkerClick: (markerId: number, location?: string) => void;
  className?: string;
}

export default function PublicMapView({
  onMarkerClick,
  className,
}: PublicMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const originPosRef = useRef<{ top: string; left: string } | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchBaseScaleRef = useRef(1);
  const isPinchingRef = useRef(false);
  const scaleRef = useRef(1);
  const [scale, setScale] = useState(1);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

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

  const pickNearestMarker = () => {
    if (!originPosRef.current) return null;
    const ox = parseFloat(originPosRef.current.left);
    const oy = parseFloat(originPosRef.current.top);
    let bestId: number | null = null;
    let bestDist = Infinity;
    for (const m of markers) {
      const mx = parseFloat(m.left);
      const my = parseFloat(m.top);
      const d2 = (mx - ox) * (mx - ox) + (my - oy) * (my - oy);
      if (d2 < bestDist) {
        bestDist = d2;
        bestId = m.id;
      }
    }
    return bestId;
  };

  const updateZoomState = (next: number) => {
    scaleRef.current = next;
    setScale(next);
    if (next > 1.02) setActiveMarkerId(pickNearestMarker());
    else setActiveMarkerId(null);
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

  // 마커가 있는 지역을 지도에 표시
  useEffect(() => {
    const mapElement = document.querySelector(
      '#public-map-container img[alt="지도"]'
    );
    if (!mapElement) return;

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

          markers.forEach((marker) => {
            if (marker.location) {
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
      id="public-map-container"
      ref={containerRef}
      className={`relative mb-20 cursor-pointer overflow-hidden ${
        className || ''
      }`}
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
              zoomed={scale > 1.02}
              onMarkerClick={(id, location) => onMarkerClick(id, location)}
              isPublic={true}
            />
          );
        })}
      </div>
    </main>
  );
}
