import { useLocation } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import defaultMapImage from '../../assets/map-share1.svg';
import { getImageBlob, downloadBlob } from '../../utils/image';

export default function SharePage() {
  const location = useLocation();

  const imageUrl = location.state?.imageUrl || defaultMapImage;
  const previewImage = location.state?.previewImage as string | undefined;
  const displayImage = previewImage || imageUrl;
  const isCaptured = Boolean(previewImage) || imageUrl !== defaultMapImage;

  const handleSaveImage = async () => {
    if (!isCaptured) {
      return;
    }

    try {
      const blobSource = previewImage || imageUrl;
      const blob = await getImageBlob(blobSource);
      const filename = `my-map-${new Date().toISOString().split('T')[0]}.png`;
      downloadBlob(blob, filename);
      alert('지도 이미지가 저장되었습니다!');
    } catch (error) {
      console.error('지도 이미지 저장 실패:', error);
      alert('이미지를 저장하지 못했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col max-w-[480px] mx-auto bg-white">
      <DropdownHeader title="공유" />

      <main
        className="flex flex-col items-center pt-10 px-6 bg-white"
        style={{ height: 'calc(100vh - 112px - 80px)', overflowY: 'auto' }}
      >
        <h2 className="text-2xl font-extrabold text-[#444444]">
          {isCaptured ? '나의 경기 지도 생성 완료!' : '지도 공유 페이지'}
        </h2>
        <p className="text-[#A3A3A3] font-bold mt-2">
          사진을 갤러리에 저장할까요?
        </p>

        <div className="mt-6 mb-8 p-3 bg-white shadow-lg rounded-lg border border-gray-100 relative max-w-[340px]">
          <img
            src={displayImage}
            alt="생성된 경기 지도"
            className="w-full h-auto rounded"
          />
        </div>

        <div className="w-full px-7">
          <button
            onClick={handleSaveImage}
            className="w-full bg-[#FF7070] text-white text-lg font-bold py-3.5 rounded-full hover:bg-[#E05A5A] transition-colors"
          >
            사진 저장
          </button>
        </div>
      </main>
    </div>
  );
}
