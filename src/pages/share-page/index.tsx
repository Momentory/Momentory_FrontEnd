import { useNavigate, useLocation } from 'react-router-dom';

import backArrowIcon from '../../assets/icons/BackIcon.svg';
import dropdownIcon from '../../assets/icons/dropdown.svg';

// Fallback용 이미지
import defaultMapImage from '../../assets/map-share1.svg';

export default function SharePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const imageUrl = location.state?.imageUrl || defaultMapImage;
  const isCaptured = imageUrl !== defaultMapImage;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSaveImage = () => {
    // 캡처된 이미지(data: URL)일 경우 다운로드
    if (isCaptured && imageUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.download = `my-map-${new Date().toISOString().split('T')[0]}.png`;
      link.href = imageUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log('사진 저장 버튼 클릭 (Fallback)');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-gray-50">
      {/* 상단 네비게이션 바 */}
      <header className="sticky top-0 flex items-center justify-between p-4 bg-white border-b border-gray-200 z-10">
        <button onClick={handleGoBack} className="p-1">
          <img src={backArrowIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1 cursor-pointer">
          <h1 className="text-lg font-bold">공유</h1>
          <img src={dropdownIcon} alt="옵션" className="w-4 h-4" />
        </div>
        <div className="w-7 h-7" />
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col items-center pt-8 px-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#444444]">
          {isCaptured ? '나의 경기 지도 생성 완료!' : '지도 공유 페이지'}
        </h2>
        <p className="text-[#A3A3A3] mt-2">사진을 갤러리에 저장할까요?</p>

        {/* 생성된 지도 이미지 */}
        <div className="mt-6 p-3 bg-white shadow-lg rounded-lg border border-gray-100 relative">
          <img
            src={imageUrl}
            alt="생성된 경기 지도"
            className="w-80 h-[430px] rounded object-cover"
          />

          {/* 날짜 오버레이 표시 (캡처된 이미지일 때만) */}
          {isCaptured && (
            <span
              className="absolute bottom-3 right-3 text-white text-sm font-semibold px-2 py-1"
              style={{
                textShadow:
                  '1px 1px 0 #AAAAAA, -1px -1px 0 #AAAAAA, 1px -1px 0 #AAAAAA, -1px 1px 0 #AAAAAA',
              }}
            >
              {new Intl.DateTimeFormat('fr-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).format(new Date())}
            </span>
          )}
        </div>
      </main>

      {/* 하단 '사진 저장' 버튼 */}
      <footer className="p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleSaveImage}
          className="w-full bg-[#FF7070] text-white text-lg font-bold py-3.5 rounded-full
                     hover:bg-[#E05A5A] transition-colors"
        >
          사진 저장
        </button>
      </footer>
    </div>
  );
}
