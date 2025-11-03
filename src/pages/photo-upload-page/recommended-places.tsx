import { useLocation } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';

export default function RecommendedPlacesPage() {
  const location = useLocation();

  const recentStamps = location.state?.recentStamps || [
    { name: '고양 꽃 축제', image: '/stamps/고양시.svg' },
    { name: '광명동굴', image: '/cultural-stamps/광명동굴.svg' },
    { name: '남한산성', image: '/stamps/광주시.svg' },
  ];

  const nearbyPlaces = [
    {
      id: 1,
      name: '일산 호수공원',
      image: '/images/everland.jpg',
      tags: ['#놀이공원', '#야경'],
      distance: '0.8 km',
      rating: 4.0,
    },
    {
      id: 2,
      name: '일산 호수공원',
      image: '/images/everland.jpg',
      tags: ['#놀이공원', '#야경'],
      distance: '0.8 km',
      rating: 4.0,
    },
    {
      id: 3,
      name: '일산 호수공원',
      image: '/images/everland.jpg',
      tags: ['#놀이공원', '#야경'],
      distance: '0.8 km',
      rating: 4.0,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[480px] mx-auto relative overflow-hidden">
      <DropdownHeader title="추천 여행지" />

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[35px] right-[-150px] w-[440px] h-[440px] overflow-hidden">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: '#FFEFE0',
              opacity: 0.6,
            }}
          />
        </div>

        <div className="absolute top-[400px] left-[-90px] w-[320px] h-[320px] overflow-hidden">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: '#FFE5E0',
              opacity: 0.6,
            }}
          />
        </div>

        <div className="absolute top-[670px] right-[-80px] w-[250px] h-[250px] overflow-hidden">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: '#F4ECE4',
              opacity: 0.6,
            }}
          />
        </div>
      </div>

      <div className="px-6 py-8 bg-transparent relative z-10">
        <p className="text-[22px] text-[#444444] text-left font-bold">
          지금까지 <span className="text-[#BD4141]">문화</span> 스탬프 5개,{' '}
          <br />
          <span className="text-[#BD4141]">지역</span> 스탬프 3개를 모으셨어요!
        </p>

        <div className="mt-6 p-5 bg-[#FF7070] rounded-xl">
          <h2 className="text-base font-bold text-white mb-4">
            최근에 얻은 스탬프
          </h2>
          <div className="flex gap-3 justify-center">
            {recentStamps
              .slice(0, 3)
              .map((stamp: { name: string; image: string }, index: number) => (
                <div
                  key={index}
                  className="w-30 h-30 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md"
                >
                  <img
                    src={stamp.image}
                    alt={stamp.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ))}
          </div>
          <div className="flex justify-end mt-3">
            <button className="text-sm text-white font-medium">
              내 스탬프 컬렉션 보러가기 &gt;
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 pb-24 relative z-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          주변 추천 관광지
        </h2>

        <div className="space-y-4">
          {nearbyPlaces.map((place) => (
            <div
              key={place.id}
              className="flex gap-5 p-3 bg-white rounded-xl hover:bg-gray-100 transition cursor-pointer shadow-md"
              onClick={() => {}}
            >
              <img
                src={place.image}
                alt={place.name}
                className="w-35 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {place.name}
                </h3>

                <div className="flex gap-1 mb-2">
                  {place.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs text-[#A74242] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-sm text-[#A8A8A8]">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {place.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    {place.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
