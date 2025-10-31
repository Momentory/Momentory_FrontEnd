import { useLocation } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import defaultMapImage from '../../assets/map-share1.svg';

export default function SharePage() {
  const location = useLocation();

  const imageUrl = location.state?.imageUrl || defaultMapImage;
  const isCaptured = imageUrl !== defaultMapImage;

  const handleSaveImage = () => {
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
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-white">
      <DropdownHeader title="공유" />

      <main className="flex-1 flex flex-col items-center pt-10 px-6 overflow-y-auto bg-white">
        <h2 className="text-2xl font-bold text-[#444444]">
          {isCaptured ? '나의 경기 지도 생성 완료!' : '지도 공유 페이지'}
        </h2>
        <p className="text-[#A3A3A3] mt-2">사진을 갤러리에 저장할까요?</p>

        <div className="mt-6 p-3 bg-white shadow-lg rounded-lg border border-gray-100 relative max-w-[340px]">
          <img
            src={imageUrl}
            alt="생성된 경기 지도"
            className="w-full h-auto rounded"
          />
        </div>
      </main>

      <footer className="px-7 py-4 mb-17 bg-white">
        <button
          onClick={handleSaveImage}
          className="w-full bg-[#FF7070] text-white text-lg font-bold py-3.5 rounded-full hover:bg-[#E05A5A] transition-colors"
        >
          사진 저장
        </button>
      </footer>
    </div>
  );
}
