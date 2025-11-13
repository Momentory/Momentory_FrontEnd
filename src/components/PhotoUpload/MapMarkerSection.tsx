import { useEffect, useState } from 'react';
import map from '../../assets/gyeonggi-map.svg';
import { gpsToMapPosition, extractCityName } from '../../utils/mapCoordinates';

interface MapMarkerSectionProps {
  markerColor: string;
  markerLocation: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  onMarkerClick: () => void;
}

export default function MapMarkerSection({
  markerColor,
  markerLocation,
  onMarkerClick,
}: MapMarkerSectionProps) {
  const [mapPosition, setMapPosition] = useState({ top: '50%', left: '50%' });
  const [_cityName, setCityName] = useState<string | null>(null);

  useEffect(() => {
    if (!markerLocation) {
      return;
    }
    const position = gpsToMapPosition(markerLocation.lat, markerLocation.lng);
    setMapPosition(position);

    const city = extractCityName(markerLocation.address);
    setCityName(city);
  }, [markerLocation]);

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
        className="relative w-full h-64 rounded-lg overflow-hidden bg-white"
        style={{
          border: '2px solid #CECECE',
        }}
      >
        <div className="relative w-full h-full">
          <img
            src={map}
            alt="지도"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {markerLocation && (
            <div
              className="absolute cursor-pointer z-10 drop-shadow-lg transition-all duration-200"
              style={{
                top: mapPosition.top,
                left: mapPosition.left,
                transform: 'translate(-50%, -100%)',
              }}
              onClick={onMarkerClick}
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
          )}
        </div>
      </div>
    </div>
  );
}
