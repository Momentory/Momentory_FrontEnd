import { useEffect, useState, useMemo } from 'react';
import map from '../../assets/gyeonggi-map.svg';
import { gpsToMapPosition, extractCityName } from '../../utils/mapCoordinates';
import RegionColorLayer from '../map/RegionColorLayer';

interface MapMarkerSectionProps {
  markerColor: string;
  markerLocation: {
    address: string;
    lat: number;
    lng: number;
    cityName?: string;
  } | null;
  onMarkerClick: () => void;
}

export default function MapMarkerSection({
  markerColor,
  markerLocation,
  onMarkerClick,
}: MapMarkerSectionProps) {
  // GPS 정보가 없을 때 사용할 기본 GPS 좌표 (경기도 내부 - 남양주시)
  const defaultLat = 37.6367;
  const defaultLng = 127.2165;
  const defaultPosition = useMemo(
    () => gpsToMapPosition(defaultLat, defaultLng),
    []
  );

  const [mapPosition, setMapPosition] = useState(defaultPosition);
  const [cityName, setCityName] = useState<string | null>(null);

  useEffect(() => {
    if (!markerLocation) {
      // GPS 정보가 없으면 기본 위치와 기본 도시(남양주시) 사용
      setMapPosition(defaultPosition);
      setCityName('남양주시');
      return;
    }
    // GPS 정보가 있으면 실제 GPS 좌표로 위치 계산
    const position = gpsToMapPosition(markerLocation.lat, markerLocation.lng);
    setMapPosition(position);

    // 주소에서 시/군 추출하거나, 부모에서 전달된 cityName 사용
    const city =
      extractCityName(markerLocation.address) || markerLocation.cityName || null;
    setCityName(city);
  }, [markerLocation, defaultPosition]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 183, b: 183 };
  };

  const darkenColor = (rgb: { r: number; g: number; b: number }) => {
    return {
      r: Math.max(0, Math.floor(rgb.r * 0.9)),
      g: Math.max(0, Math.floor(rgb.g * 0.9)),
      b: Math.max(0, Math.floor(rgb.b * 0.9)),
    };
  };

  const rgb = hexToRgb(markerColor);
  const darkRgb = darkenColor(rgb);
  const gradientStart = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const gradientEnd = `rgb(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b})`;

  return (
    <div className="py-3">
      <h2 className="text-[18px] font-semibold mb-3">지도 마커</h2>

      <div
        id="upload-map-container"
        className="relative w-full h-64 rounded-lg overflow-hidden bg-white cursor-pointer"
        style={{
          border: '2px solid #CECECE',
        }}
        onClick={onMarkerClick}
      >
        <div className="relative w-full h-full">
          <img
            src={map}
            alt="지도"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* 선택된 지역 색상 오버레이 */}
          {cityName && (
            <RegionColorLayer colorMap={{ [cityName]: markerColor }} />
          )}

          <div
            className="absolute cursor-pointer z-[5] drop-shadow-lg transition-all duration-200"
            style={{
              top: mapPosition.top,
              left: mapPosition.left,
              transform: 'translate(-50%, -100%)',
            }}
          >
              <svg
                width="33"
                height="34"
                viewBox="0 0 33 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.43934 30.83C-0.146447 31.4158 -0.146447 32.3655 0.43934 32.9513C1.02513 33.5371 1.97487 33.5371 2.56066 32.9513L1.5 31.8906L0.43934 30.83ZM1.5 31.8906L2.56066 32.9513L20.3425 15.1695L19.2818 14.1088L18.2211 13.0482L0.43934 30.83L1.5 31.8906Z"
                  fill="#A6A6A6"
                />
                <circle
                  cx="19.1106"
                  cy="13.5"
                  r="11.5"
                  fill="url(#paint0_linear_pin)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_pin"
                    x1="19.1106"
                    y1="2"
                    x2="19.1106"
                    y2="25"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={gradientStart} />
                    <stop offset="1" stopColor={gradientEnd} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
        </div>
      </div>
    </div>
  );
}
