import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import CloseIcon from '../../assets/icons/closeIcon.svg?react';

// 임시 사진 데이터 (실제로는 API에서 가져올 데이터)
const mockPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    date: '2025.01.15',
    description:
      '도시의 경관이 멋지네요. 아늑하고 아름다운 풍경을 찾으러 경기도를 여행하고 있는데 여기와 같은 도시 거리가 또 없는 것 같아요.',
    location: '경기도 고양시, 스타필드',
    author: '여행하는고래',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
    date: '2025.01.14',
    description:
      '따뜻한 노을빛이 물드는 순간을 담아봤어요. 오늘 하루도 고생 많았어요!',
    location: '경기도 시흥시, 오이도',
    author: '써니',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    date: '2025.01.13',
    description: '시원한 파도 소리를 들으며 잠시 머리를 식히고 왔어요.',
    location: '경기도 안산시, 대부도',
    author: '바람타는남자',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
    date: '2025.01.12',
    description: '지금부터 여행 시작! 설레는 마음을 담아 첫 사진을 찍어봤어요.',
    location: '경기도 수원시, 수원역',
    author: '여행자J',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    date: '2025.01.11',
    description: '카페 창가에 앉아 친구와 수다 떨기 딱 좋은 날씨였어요.',
    location: '경기도 성남시, 분당',
    author: '민트초코',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
    date: '2025.01.10',
    description: '바람이 선선해서 산책하기 너무 좋았던 하루.',
    location: '경기도 파주시, 임진각',
    author: '폴라로이드',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    date: '2025.01.09',
    description:
      '눈 앞에서 펼쳐진 푸른 바다. 마음까지 시원해지는 느낌이었어요.',
    location: '경기도 화성시, 궁평항',
    author: '비치보이',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
    date: '2025.01.08',
    description: '햇살이 좋아서 그냥 걷기만 해도 행복했던 시간.',
    location: '경기도 광명시, 광명동굴',
    author: '햇살한모금',
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    date: '2025.01.07',
    description: '책 한 권 들고 잔잔한 공원 벤치에서 휴식을 즐겼어요.',
    location: '경기도 용인시, 호수공원',
    author: '책읽는토끼',
  },
];

export default function RegionPhotosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPublic = location.state?.isPublic || false;

  // TODO: API 연동 - 공개/전체 사진 목록 가져오기
  const photos = useMemo(() => mockPhotos, []);

  const headerTitle = isPublic ? '공개 중인 전체 사진' : '내가 올린 전체 사진';

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-white overflow-hidden">
      <DropdownHeader
        title={headerTitle}
        leftIcon={<CloseIcon className="w-6 h-6" />}
        onLeftClick={() => navigate(isPublic ? '/publicMap' : '/myMap')}
      />

      <div className="flex-1 overflow-y-auto bg-[#F8F4F4] px-5 pb-24 pt-[116px]">
        {photos.length > 0 ? (
          <div className="bg-[#EDE2E2] px-5 py-6">
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() =>
                    navigate('/all-my-photos/viewer', {
                      state: { photos, startIndex: index, isPublic },
                    })
                  }
                  className="bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative aspect-119/234 w-full overflow-hidden border border-[#CC7272] bg-[#EDE2E2]">
                    <img
                      src={photo.url}
                      alt={`전체 사진 ${photo.id}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0VERTJFMkUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mHPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[#A3A3A3]">
            <p className="text-base font-semibold">
              {isPublic
                ? '아직 공개된 사진이 없어요.'
                : '아직 업로드한 사진이 없어요.'}
            </p>
            {!isPublic && (
              <button
                type="button"
                onClick={() => navigate('/upload')}
                className="mt-6 rounded-xl bg-[#FF7070] px-6 py-3 text-white shadow-md transition hover:shadow-lg"
              >
                사진 업로드하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
