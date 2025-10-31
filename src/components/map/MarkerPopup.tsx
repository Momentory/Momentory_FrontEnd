// 마커와 이미지 팝업 UI
import type { Marker, Album } from '../../types/map/map';
import { useNavigate } from 'react-router-dom';

interface Props {
  marker: Marker;
  active: boolean;
  album?: Album;
  zoomed: boolean;
  onMarkerClick?: (markerId: number, location?: string) => void;
  style?: React.CSSProperties;
  isPublic?: boolean; // 전체 지도인지 여부
}

export default function MarkerPopup({
  marker,
  active,
  album,
  zoomed,
  onMarkerClick,
  style,
  isPublic = false,
}: Props) {
  const navigate = useNavigate();
  const rightSide = parseFloat(marker.left) > 70;

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 이미지 팝업 클릭 시 아무 동작 안 함
  };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top: marker.top, left: marker.left, ...style }}
    >
      {(!zoomed || active) && (
        <img
          src={marker.image}
          className="w-8 h-8 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onMarkerClick && onMarkerClick(marker.id, marker.location);
          }}
        />
      )}

      {zoomed && active && album && (
        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center"
          style={{ left: rightSide ? 'calc(-112px)' : 'calc(100% + 12px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="absolute w-4 h-4 rounded-full bg-[#FF7070] z-20 -top-1 -left-1" />
            <img
              src={album.imageUrl}
              className="w-[100px] h-[62px] rounded-lg shadow-md cursor-pointer relative z-10 border-2 border-white"
              onClick={handleImageClick}
            />

            {/* div를 삭제하면 이미지 팝업이 잘리는 문제 발생 -> 'invisible' 클래스 추가해서 숨김*/}
            <div className="mt-1 flex items-center gap-1 invisible">
              <span className="w-4 h-4 bg-[#732727] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {album.id}
              </span>
              <p className="text-sm font-bold whitespace-nowrap">
                나의 앨범 페이지로 이동
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
