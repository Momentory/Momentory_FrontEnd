import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';

// 임시 사진 데이터 (실제로는 API에서 가져올 데이터)
const mockPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    date: '2025.01.15',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
    date: '2025.01.14',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    date: '2025.01.13',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
    date: '2025.01.12',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    date: '2025.01.11',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
    date: '2025.01.10',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    date: '2025.01.09',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
    date: '2025.01.08',
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    date: '2025.01.07',
  },
];

export default function RegionPhotosPage() {
  const { region } = useParams<{ region: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isPublic = location.state?.isPublic || false;
  const [_selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // TODO: API 연동 - 지역별 사진 목록 가져오기
  // isPublic ? 공개된 사진만 : 내 모든 사진 (공개/비공개 무관)
  const photos = mockPhotos; // 실제로는 API에서 가져온 데이터
  const decodedRegion = region ? decodeURIComponent(region) : '';

  const handlePhotoClick = (photoId: number) => {
    // TODO: 사진 상세 페이지로 이동 또는 모달 표시
    setSelectedPhoto(photoId);
  };

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-white">
      <DropdownHeader title={`${decodedRegion} 사진`} />

      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 pt-[120px]">
        {/* 헤더 섹션 */}
        <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-[#444444]">
              경기도 {decodedRegion}
            </h1>
            <div className="flex items-center gap-1 text-sm text-[#A3A3A3]">
              <span className="font-semibold text-[#8D8D8D]">
                {photos.length}
              </span>
              <span>장</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#8D8D8D]">
              {isPublic ? '공개된 사진' : '내가 올린 모든 사진'}
            </span>
            {isPublic && (
              <span className="text-xs text-[#A3A3A3]">(모든 사용자)</span>
            )}
          </div>
        </div>

        {/* 사진 그리드 */}
        {photos.length > 0 ? (
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => handlePhotoClick(photo.id)}
                >
                  <img
                    src={photo.url}
                    alt={`${decodedRegion} 사진 ${photo.id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 플레이스홀더
                      e.currentTarget.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0VERTJFMkUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mHPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                  {/* 날짜 배지 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white text-xs font-medium">
                      {photo.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 빈 상태 */
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
            <div className="w-24 h-24 rounded-full bg-[#EDE2E2] flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-[#C8B6B6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#444444] mb-2">
              아직 사진이 없어요
            </h3>
            <p className="text-center text-[#A3A3A3] text-sm mb-6 max-w-xs">
              {isPublic
                ? `${decodedRegion}에 공개된 사진이 아직 없습니다.`
                : `${decodedRegion}에 업로드한 사진이 아직 없습니다.`}
            </p>
            {!isPublic && (
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-3 bg-[#FF7070] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                사진 업로드하기
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
