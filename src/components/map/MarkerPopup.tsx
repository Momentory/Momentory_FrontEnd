// 마커와 이미지 팝업 UI
import type { Marker } from '../../types/map';
import defaultMarkerIcon from '../../assets/map-pin.svg';

interface Props {
  marker: Marker;
  active: boolean;
  zoomed: boolean;
  mapScale: number;
  onMarkerClick?: (markerId: number, location?: string) => void;
  style?: React.CSSProperties;
}

export default function MarkerPopup({
  marker,
  active,
  zoomed,
  mapScale,
  onMarkerClick,
  style,
}: Props) {
  const leftValue = parseFloat(marker.left);
  const rightSide = Number.isNaN(leftValue) ? false : leftValue > 70;
  const photo = marker.photo;
  const markerColor = marker.color ?? '#FF7070';
  const iconSrc = marker.image ?? defaultMarkerIcon;

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkerClick?.(marker.id, marker.location);
  };

  const inverseScale = mapScale > 1 ? 1 / mapScale : 1;
  const MARKER_RADIUS = 10; // marker width 20px / 2
  const GAP = 1;
  const POPUP_WIDTH = 100;
  const POPUP_HEIGHT = 62;
  const POPUP_BORDER = 2;
  const desiredOffset = MARKER_RADIUS * mapScale + GAP;
  const translateX = (rightSide ? -1 : 1) * desiredOffset;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top: marker.top, left: marker.left, ...style }}
    >
      {(!zoomed || active) && (
        <img
          src={iconSrc}
          alt={marker.location ?? '지도 마커'}
          className="w-5 h-5 cursor-pointer drop-shadow-md"
          onClick={handleMarkerClick}
        />
      )}

      {zoomed && active && photo?.imageUrl && (
        <div
          className="absolute left-1/2 top-1/2 -translate-y-1/2"
          style={{
            transform: `translateX(${translateX}px)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              transform: `scale(${inverseScale})`,
              transformOrigin: rightSide ? '100% 50%' : '0% 50%',
              width: POPUP_WIDTH,
              height: POPUP_HEIGHT,
            }}
          >
            <div
              className="absolute z-20 rounded-full"
              style={{
                width: 16,
                height: 16,
                top: -8,
                [rightSide ? 'right' : 'left']: -8,
                backgroundColor: markerColor,
                border: `${POPUP_BORDER}px solid white`,
              }}
            />
            <img
              src={photo.imageUrl}
              alt={photo.address || marker.location || '최근 사진'}
              className="rounded-lg shadow-md cursor-pointer object-cover bg-[#EDE2E2]"
              style={{
                width: POPUP_WIDTH,
                height: POPUP_HEIGHT,
                border: `${POPUP_BORDER}px solid white`,
              }}
              onClick={handleMarkerClick}
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYyIiBmaWxsPSIjRUVFMiIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSI2MiIgZmlsbD0iI0VERTJFMkUiIHJ4PSIxMiIvPjxnIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCI+PHRleHQgeD0iNTAlIiB5PSI1MCUiPm5vIGltYWdlPC90ZXh0PjwvZz48L3N2Zz4=';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
