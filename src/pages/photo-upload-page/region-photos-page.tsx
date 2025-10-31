import { useParams, useLocation } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';

export default function RegionPhotosPage() {
  const { region } = useParams<{ region: string }>();
  const location = useLocation();
  const isPublic = location.state?.isPublic || false;

  // TODO: API 연동 - 지역별 사진 목록 가져오기
  // isPublic ? 공개된 사진만 : 내 모든 사진 (공개/비공개 무관)

  const decodedRegion = region ? decodeURIComponent(region) : '';

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-white">
      <DropdownHeader title={`${decodedRegion} 사진`} />

      <main className="flex-1 flex flex-col px-6 py-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-[#444444] mb-4">
          {isPublic ? '공개된 사진' : '내 사진'}
        </h2>

        {/* TODO: 사진 그리드 UI */}
        <div className="grid grid-cols-3 gap-2">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
        </div>

        <p className="text-center text-gray-500 mt-8">
          {decodedRegion}의 사진이 여기에 표시됩니다.
          <br />
          <span className="text-sm">
            {isPublic ? '(공개된 사진만)' : '(내 모든 사진)'}
          </span>
        </p>
      </main>
    </div>
  );
}

