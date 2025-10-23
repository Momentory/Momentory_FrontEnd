import React from 'react';

// 1. assets 폴더에서 SVG 파일들을 import
import mapBack from '../../assets/map-back.svg';
import map from '../../assets/map.svg';
import shareButton from '../../assets/share-button.svg';

// 2. 새로 추가한 마커 SVG 파일 3개 임포트
import marker1 from '../../assets/map-marker1.svg';
import marker2 from '../../assets/map-marker2.svg';
import marker3 from '../../assets/map-marker3.svg';

// 3. markersData 수정: 'color' 대신 'image' 속성 사용
const markersData = [
  { id: 1, type: 'basic', top: '20%', left: '15%', image: marker1 },
  { id: 2, type: 'basic', top: '35%', right: '20%', image: marker2 },
  { id: 3, type: 'basic', top: '70%', left: '40%', image: marker3 },
];

function MapPage() {
  const handleShareClick = () => {
    console.log('공유 버튼 클릭');
    // TODO: 하단 패널(Bottom Sheet) 열기 로직 구현
  };

  return (
    // 전체 페이지 컨테이너
    <div className="relative h-full font-Pretendard flex justify-center items-center bg-gray-50">
      {/* 실제 앱 화면 컨테이너 (max-w-[390px]) */}
      <div className="relative w-full max-w-[390px] h-full bg-white shadow-lg overflow-hidden">
        {/* 지도 내용이 들어갈 메인 영역 */}
        <main
          className="h-full w-full relative flex items-center justify-center"
          style={{
            backgroundImage: `url(${mapBack})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* 지도 외곽선 SVG */}
          <img
            src={map}
            alt="지도"
            className="absolute inset-0 w-full h-full object-contain z-0"
          />

          {/* 마커들을 map()으로 렌더링 */}
          {markersData.map((marker) => (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                top: marker.top,
                left: marker.left,
                right: marker.right,
              }}
            >
              {/* 4. <span>을 <img /> 태그로 변경 */}
              {marker.type === 'basic' && (
                <img
                  src={marker.image}
                  alt="맵 마커"
                  // 마커 SVG 크기에 맞게 w, h를 조절하세요. (예: w-8 h-8)
                  className="w-8 h-8"
                />
              )}
            </div>
          ))}
        </main>

        {/* 플로팅 버튼 (FAB) */}
        <button
          onClick={handleShareClick}
          className="absolute bottom-28 right-6 w-14 h-14 shadow-lg z-20"
        >
          <img src={shareButton} alt="공유하기" className="w-full h-full" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
            1
          </span>
        </button>

        {/* 하단 패널 (Bottom Sheet) */}
        <div className="absolute bottom-0 w-full h-20 bg-white rounded-t-2xl flex justify-center pt-3 shadow-lg z-30">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default MapPage;
