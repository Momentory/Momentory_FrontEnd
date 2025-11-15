import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import DropdownHeader from '../../components/common/DropdownHeader';
import { useRecentStamps } from '../../hooks/stamp/useStampQueries';
import { usePhotoNearby } from '../../hooks/photo/usePhotoMutations';
import {
  getStampImagePath,
  getCulturalStampImagePath,
  extractRegionName,
  mapCulturalSpotName,
} from '../../utils/stampUtils';
import type { RecentStampItem } from '../../types/stamp';

type NearbyPlace = {
  id?: number | string;
  name: string;
  image: string;
  tags?: string[];
  distance?: string;
  rating?: number;
};

type RecentStampDisplay = {
  name: string;
  image: string;
};

export default function RecommendedPlacesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data,
    isLoading: isRecentLoading,
    isError: isRecentError,
  } = useRecentStamps();
  const { mutateAsync: fetchNearbySpots } = usePhotoNearby();

  const photoId = location.state?.photoId as number | undefined;

  // nearbySpots를 NearbyPlace[]로 변환
  const initialNearbySpots = location.state?.nearbySpots as
    | Array<{
        name: string;
        type: string;
        region: string;
        address: string;
        tel: string;
        imageUrl: string;
      }>
    | undefined;

  const initialNearbyPlaces: NearbyPlace[] = useMemo(() => {
    if (initialNearbySpots && initialNearbySpots.length > 0) {
      return initialNearbySpots.map((spot, index) => ({
        id: `${spot.name}-${index}`,
        name: spot.name,
        image: spot.imageUrl || '/images/default.jpg',
        tags: [spot.region, spot.type].filter(Boolean) as string[],
        distance: undefined,
        rating: undefined,
      }));
    }
    return [];
  }, [initialNearbySpots]);

  const [nearbyPlaces, setNearbyPlaces] =
    useState<NearbyPlace[]>(initialNearbyPlaces);
  const [isNearbyLoading, setIsNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState<string | null>(null);

  const recentStamps: RecentStampDisplay[] = useMemo(() => {
    const items = data?.result ?? [];
    if (!items.length) {
      return [];
    }

    const toDisplay = (stamp: RecentStampItem): RecentStampDisplay => {
      const type = stamp.type?.toUpperCase();

      if (type === 'REGIONAL') {
        const region = extractRegionName(stamp.region || stamp.spotName);
        return { name: region, image: getStampImagePath(region) };
      }

      const { stampDisplayName } = mapCulturalSpotName(stamp.spotName);
      return {
        name: stampDisplayName,
        image: getCulturalStampImagePath(stampDisplayName),
      };
    };

    return items.slice(0, 3).map(toDisplay);
  }, [data?.result]);

  const stampCounts = useMemo(() => {
    if (!data) {
      return { cultural: 0, regional: 0 };
    }

    const items = data.result ?? [];
    const countByType = (type: 'REGIONAL' | 'CULTURAL') =>
      items.filter((s) => s.type?.toUpperCase() === type).length;

    return {
      cultural:
        typeof data.totalCulturalCount === 'number'
          ? data.totalCulturalCount
          : countByType('CULTURAL'),
      regional:
        typeof data.totalRegionalCount === 'number'
          ? data.totalRegionalCount
          : countByType('REGIONAL'),
    };
  }, [data, data?.totalCulturalCount, data?.totalRegionalCount, data?.result]);

  const recentStampState = isRecentLoading
    ? 'loading'
    : isRecentError
      ? 'error'
      : recentStamps.length
        ? 'success'
        : 'empty';

  useEffect(() => {
    console.log('[RecommendedPlaces] photoId:', photoId);
    console.log('[RecommendedPlaces] initialNearbySpots:', initialNearbySpots);
    console.log('[RecommendedPlaces] initialNearbyPlaces:', initialNearbyPlaces);

    // photoId가 없으면 initialNearbyPlaces를 사용하거나 빈 배열
    if (!photoId) {
      console.log('[RecommendedPlaces] photoId가 없어서 API 호출하지 않음');
      if (initialNearbyPlaces.length > 0) {
        setNearbyPlaces(initialNearbyPlaces);
      } else {
        setNearbyPlaces([]);
      }
      return;
    }

    // photoId가 있으면 API 호출
    // 단, initialNearbyPlaces가 이미 있으면 먼저 표시하고 API 호출
    if (initialNearbyPlaces.length > 0) {
      setNearbyPlaces(initialNearbyPlaces);
    }

    let isMounted = true;
    setIsNearbyLoading(true);
    setNearbyError(null);

    console.log('[RecommendedPlaces] API 호출 시작, photoId:', photoId);
    fetchNearbySpots({ photoId, limit: 6 })
      .then((response) => {
        console.log('[RecommendedPlaces] API 응답:', response);
        if (!isMounted) {
          return;
        }
        const spots = response.result?.spots ?? [];
        console.log('[RecommendedPlaces] spots:', spots);

        // spots가 비어있으면 initialNearbyPlaces 사용
        if (spots.length === 0) {
          console.log('[RecommendedPlaces] API 응답 spots가 비어있음, initialNearbyPlaces 사용');
          if (initialNearbyPlaces.length > 0) {
            setNearbyPlaces(initialNearbyPlaces);
          }
          return;
        }

        const mapped = spots.map((spot, index) => ({
          id: `${spot.name}-${index}`,
          name: spot.name,
          image: spot.imageUrl || '/images/default.jpg',
          tags: [spot.region, spot.type].filter(Boolean) as string[],
          distance: undefined,
          rating: undefined,
        }));
        console.log('[RecommendedPlaces] mapped places:', mapped);
        setNearbyPlaces(mapped);
      })
      .catch((error) => {
        console.error('[RecommendedPlaces] 근처 관광지 추천 조회 실패:', error);
        if (!isMounted) {
          return;
        }
        setNearbyError('근처 관광지를 불러오지 못했습니다.');
        // 에러 발생 시 initialNearbyPlaces가 있으면 사용
        if (initialNearbyPlaces.length > 0) {
          setNearbyPlaces(initialNearbyPlaces);
        }
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }
        setIsNearbyLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId, initialNearbyPlaces]);

  return (
    <div className="flex flex-col min-h-screen bg-white w-full max-w-full sm:max-w-[480px] md:max-w-[600px] lg:max-w-[768px] mx-auto relative overflow-hidden">
      <DropdownHeader title="추천 여행지" />

      {/* 배경 */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible min-h-[2000px]">
        <div className="absolute top-[35px] right-[-150px] w-[440px] h-[440px]">
          <div className="w-full h-full rounded-full bg-[#FFEFE0] opacity-60" />
        </div>
        <div className="absolute top-[400px] left-[-90px] w-[320px] h-[320px]">
          <div className="w-full h-full rounded-full bg-[#FFE5E0] opacity-60" />
        </div>
        <div className="absolute top-[670px] right-[-80px] w-[250px] h-[250px]">
          <div className="w-full h-full rounded-full bg-[#F4ECE4] opacity-60" />
        </div>
        {/* 하단 배경 곡선 도형 */}
        <div className="absolute top-[1000px] left-[-120px] w-[380px] h-[380px]">
          <div className="w-full h-full rounded-full bg-[#FFEFE0] opacity-60" />
        </div>
        <div className="absolute top-[1200px] right-[-100px] w-[300px] h-[300px]">
          <div className="w-full h-full rounded-full bg-[#FFE5E0] opacity-60" />
        </div>
        <div className="absolute top-[1400px] left-[-80px] w-[280px] h-[280px]">
          <div className="w-full h-full rounded-full bg-[#F4ECE4] opacity-60" />
        </div>
        {/* 더 하단 배경 곡선 도형 */}
        <div className="absolute top-[1700px] right-[-110px] w-[360px] h-[360px]">
          <div className="w-full h-full rounded-full bg-[#FFEFE0] opacity-60" />
        </div>
        <div className="absolute top-[1900px] left-[-90px] w-[290px] h-[290px]">
          <div className="w-full h-full rounded-full bg-[#FFE5E0] opacity-60" />
        </div>
      </div>

      {/* 스탬프 요약 */}
      <div className="px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <p className="text-lg sm:text-[22px] text-[#444] font-extrabold">
          지금까지 <span className="text-[#BD4141]">문화</span> 스탬프{' '}
          {stampCounts.cultural.toLocaleString()}개, <br />
          <span className="text-[#BD4141]">지역</span> 스탬프{' '}
          {stampCounts.regional.toLocaleString()}개를 모으셨어요!
        </p>

        <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-[#FF7070] rounded-xl">
          <h2 className="text-base sm:text-[19px] font-bold text-white mb-3 sm:mb-4">
            최근에 얻은 스탬프
          </h2>

          <div className="flex gap-2 sm:gap-3 justify-center min-h-[100px] sm:min-h-[120px] items-center">
            {recentStampState === 'loading' && (
              <span className="text-xs sm:text-sm text-white/80">불러오는 중...</span>
            )}
            {recentStampState === 'error' && (
              <span className="text-xs sm:text-sm text-white/80">
                불러오지 못했습니다.
              </span>
            )}
            {recentStampState === 'empty' && (
              <span className="text-xs sm:text-sm text-white/80">
                아직 획득한 스탬프가 없습니다.
              </span>
            )}
            {recentStampState === 'success' &&
              recentStamps.map((stamp, index) => (
                <div
                  key={`${stamp.name}-${index}`}
                  className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-lg border-2 border-[#A54545] flex items-center justify-center overflow-hidden shadow-md"
                  title={stamp.name}
                >
                  <img
                    src={stamp.image}
                    alt={stamp.name}
                    className="w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] object-contain"
                  />
                </div>
              ))}
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={() => navigate('/stamp-collection')}
              className="text-sm text-white font-medium hover:underline cursor-pointer"
            >
              내 스탬프 컬렉션 보러가기 &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 주변 관광지 */}
      <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 pb-20 sm:pb-24 relative z-10">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
          주변 추천 관광지
        </h2>

        {nearbyPlaces.length ? (
          <div className="space-y-3 sm:space-y-4">
            {nearbyPlaces.map((place, idx) => {
              const hasImage = place.image && place.image !== '/images/default.jpg';

              return (
              <div
                key={place.id ?? idx}
                className="flex gap-3 sm:gap-5 p-3 sm:p-4 bg-white rounded-3xl hover:bg-gray-100 transition cursor-pointer shadow-md"
              >
                {hasImage ? (
                  <div className="w-32 h-20 sm:w-44 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center absolute inset-0 flex-col gap-1">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" strokeWidth={2} />
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium">이미지 준비중</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-20 sm:w-44 sm:h-28 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-1 flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" strokeWidth={2} />
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium">이미지 준비중</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 truncate">
                    {place.name}
                  </h3>

                  <div className="flex gap-1 mb-2 flex-wrap">
                    {(place.tags ?? []).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs text-[#A74242] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm text-[#A8A8A8]">
                    {place.distance && <span>{place.distance}</span>}
                    {place.rating !== undefined && (
                      <span>⭐ {place.rating}</span>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : isNearbyLoading ? (
          <div className="text-center text-sm text-[#A3A3A3]">
            주변 추천 관광지를 불러오는 중입니다...
          </div>
        ) : nearbyError ? (
          <div className="text-center text-sm text-red-500">{nearbyError}</div>
        ) : (
          <div className="text-center text-sm text-[#A3A3A3]">
            추천 관광지 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
