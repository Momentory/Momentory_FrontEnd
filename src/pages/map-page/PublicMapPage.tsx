import React, { useState } from 'react';

// 1. assets 폴더에서 SVG 파일들을 import
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/map.svg';
import shareButton from '../../assets/share-button.svg';

// 2. 새로 추가한 마커 SVG 파일 3개 임포트
import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';

// 3. DropdownHeader 컴포넌트와 아이콘들 임포트
import DropdownHeader from '../../components/common/DropdownHeader';
import MapPinIcon from '../../assets/map-pin.svg?react';
import LockIcon from '../../assets/lock-icon.svg?react';

// 4. markersData - 확대 전 마커 데이터
const markersData = [
  { id: 1, type: 'basic', top: '20%', left: '15%', image: marker1 },
  { id: 2, type: 'basic', top: '35%', right: '20%', image: marker2 },
  { id: 3, type: 'basic', top: '70%', left: '40%', image: marker3 },
];

// 5. 확대 후 이미지 매핑 데이터
const imageMappingData = [
  {
    id: 1,
    top: '20%',
    left: '15%',
    imageUrl:
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=150&h=150&fit=crop',
    albumTitle: '1 나의 앨범 페이지로 이동',
    badgeNumber: 1,
  },
  {
    id: 2,
    top: '35%',
    right: '20%',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
    albumTitle: '2 나의 앨범 페이지로 이동',
    badgeNumber: 2,
  },
  {
    id: 3,
    top: '70%',
    left: '40%',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
    albumTitle: '3 나의 앨범 페이지로 이동',
    badgeNumber: 3,
  },
];

// 6. DropdownHeader에 전달할 드롭다운 아이템들
const DROPDOWN_ITEMS = [
  { label: '전체 지도', icon: <MapPinIcon />, path: '/publicMap' },
  { label: '내 지도', icon: <LockIcon />, path: '/myMap' },
];

function PublicMapPage() {
  // 지도 확대 상태 관리
  const [isMapZoomed, setIsMapZoomed] = useState(false);
  // 선택된 마커 ID 관리 (null이면 확대 안됨)
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  // 하단 시트 표시 상태 관리
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleShareClick = () => {
    console.log('공유 버튼 클릭');
    // TODO: 하단 패널(Bottom Sheet) 열기 로직 구현
  };

  const handleMapZoom = () => {
    // 지도 확대/축소 토글
    setIsMapZoomed(!isMapZoomed);
    // 확대 해제시 선택된 마커와 하단 시트도 초기화
    if (isMapZoomed) {
      setSelectedMarkerId(null);
      setIsBottomSheetOpen(false);
    }
  };

  const handleMarkerClick = (markerId: number) => {
    // 지도가 확대된 상태에서만 핀 클릭 가능
    if (isMapZoomed) {
      setSelectedMarkerId(markerId);
      setIsBottomSheetOpen(true);
    }
  };

  const handleImageClick = (albumTitle: string) => {
    console.log(`${albumTitle} 클릭 - 앨범 페이지로 이동`);
    // TODO: 앨범 페이지로 이동 로직 구현
  };

  const handleMapClick = () => {
    // 지도 빈 공간 클릭시 선택된 마커와 하단 시트만 닫기 (지도 확대는 유지)
    setSelectedMarkerId(null);
    setIsBottomSheetOpen(false);
  };

  return (
    // 전체 페이지 컨테이너
    <div className="relative h-full font-Pretendard flex justify-center items-center bg-gray-50">
      {/* 실제 앱 화면 컨테이너 (max-w-[390px]) */}
      <div className="relative w-full max-w-[390px] h-full bg-white shadow-lg overflow-hidden flex flex-col">
        {/* DropdownHeader 컴포넌트 */}
        <DropdownHeader
          title="전체 지도"
          hasDropdown={true}
          dropdownItems={DROPDOWN_ITEMS}
        />

        {/* 지도 영역(main)에 mb-20을 추가하여 하단 패널 높이만큼 마진을 줍니다. */}
        <main
          className="flex-1 w-full relative flex items-center justify-center mb-20 cursor-pointer overflow-hidden"
          style={{
            backgroundImage: `url(${mapBack})`,
            backgroundSize: isMapZoomed ? '150%' : 'cover',
            backgroundPosition: isMapZoomed ? 'center' : 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'background-size 0.3s ease-in-out',
          }}
          onClick={handleMapZoom}
        >
          {/* 지도 외곽선 SVG */}
          <img
            src={map}
            alt="지도"
            className={`absolute inset-0 w-full h-full object-contain z-0 transition-transform duration-300 ${
              isMapZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={{
              transformOrigin: 'center center',
            }}
          />

          {/* 마커/이미지 렌더링 */}
          {markersData.map((marker) => {
            const isSelected = selectedMarkerId === marker.id;
            const imageData = imageMappingData.find(
              (img) => img.id === marker.id
            );

            return (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  top: marker.top,
                  left: marker.left,
                  right: marker.right,
                }}
              >
                {isMapZoomed && isSelected && imageData ? (
                  // 지도 확대 + 선택된 마커: 이미지 매핑 표시
                  <div className="relative">
                    <img
                      src={imageData.imageUrl}
                      alt="앨범 이미지"
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(imageData.albumTitle);
                      }}
                    />
                    {/* 번호 배지 */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {imageData.badgeNumber}
                    </div>
                    {/* 앨범 제목 */}
                    <div className="mt-2 text-center">
                      <p className="text-xs text-gray-600 font-medium whitespace-nowrap">
                        {imageData.albumTitle}
                      </p>
                    </div>
                  </div>
                ) : (
                  // 지도 확대 안됨 또는 선택되지 않은 마커: 핀 표시
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkerClick(marker.id);
                    }}
                    className="cursor-pointer"
                  >
                    {marker.type === 'basic' && (
                      <img
                        src={marker.image}
                        alt="맵 마커"
                        className="w-8 h-8"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </main>

        {/* 플로팅 버튼 (FAB) */}
        <button
          onClick={handleShareClick}
          className="absolute bottom-28 right-1 w-14 h-14 shadow-lg z-20"
        >
          <img src={shareButton} alt="공유하기" className="w-full h-full" />
          <span className="absolute -top-1 -left-1 w-[23px] h-[23px] bg-red-800 text-white text-sm font-bold rounded-full flex items-center justify-center">
            {imageMappingData.length}
          </span>
        </button>

        {/* 하단 시트 (Bottom Sheet) - 전체 지도에서만 표시 */}
        <div
          className={`absolute bottom-0 w-full bg-white rounded-t-2xl shadow-lg z-30 transition-transform duration-300 ${
            isBottomSheetOpen
              ? 'transform translate-y-0'
              : 'transform translate-y-full'
          }`}
        >
          {/* 드래그 핸들 */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* 하단 시트 내용 */}
          {selectedMarkerId && (
            <div className="px-6 pb-6">
              {/* 위치 정보 */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  경기도 고양시
                </h2>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500">최근 방문 2025-10-15</p>
                  <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                    하은
                  </div>
                </div>
              </div>

              {/* 공개 사진 섹션 */}
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-3">
                  공개 중인 나의 사진
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {/* 사진 그리드 */}
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                  <div className="aspect-square bg-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">+5</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicMapPage;
