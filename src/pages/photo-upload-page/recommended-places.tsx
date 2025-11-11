import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const {
    data,
    isLoading: isRecentLoading,
    isError: isRecentError,
  } = useRecentStamps();
  const { mutateAsync: fetchNearbySpots } = usePhotoNearby();

  const photoId = location.state?.photoId as number | undefined;

  const initialNearbyPlaces =
    (location.state?.nearbyPlaces as NearbyPlace[] | undefined) ?? [];
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
    if (!photoId) {
      if (!initialNearbyPlaces.length) {
        setNearbyPlaces([]);
      }
      return;
    }

    let isMounted = true;
    setIsNearbyLoading(true);
    setNearbyError(null);

    fetchNearbySpots({ photoId, limit: 6 })
      .then((response) => {
        if (!isMounted) {
          return;
        }
        const spots = response.result?.spots ?? [];
        const mapped = spots.map((spot, index) => ({
          id: `${spot.name}-${index}`,
          name: spot.name,
          image: spot.imageUrl || '/images/default.jpg',
          tags: [spot.region, spot.type].filter(Boolean) as string[],
          distance: undefined,
          rating: undefined,
        }));
        setNearbyPlaces(mapped);
      })
      .catch((error) => {
        console.error('근처 관광지 추천 조회 실패:', error);
        if (!isMounted) {
          return;
        }
        setNearbyError('근처 관광지를 불러오지 못했습니다.');
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
  }, [photoId]);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[480px] mx-auto relative overflow-hidden">
      <DropdownHeader title="추천 여행지" />

      {/* 배경 */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[35px] right-[-150px] w-[440px] h-[440px]">
          <div className="w-full h-full rounded-full bg-[#FFEFE0] opacity-60" />
        </div>
        <div className="absolute top-[400px] left-[-90px] w-[320px] h-[320px]">
          <div className="w-full h-full rounded-full bg-[#FFE5E0] opacity-60" />
        </div>
        <div className="absolute top-[670px] right-[-80px] w-[250px] h-[250px]">
          <div className="w-full h-full rounded-full bg-[#F4ECE4] opacity-60" />
        </div>
      </div>

      {/* 스탬프 요약 */}
      <div className="px-6 py-8 relative z-10">
        <p className="text-[22px] text-[#444] font-extrabold">
          지금까지 <span className="text-[#BD4141]">문화</span> 스탬프{' '}
          {stampCounts.cultural.toLocaleString()}개, <br />
          <span className="text-[#BD4141]">지역</span> 스탬프{' '}
          {stampCounts.regional.toLocaleString()}개를 모으셨어요!
        </p>

        <div className="mt-6 p-5 bg-[#FF7070] rounded-xl">
          <h2 className="text-[19px] font-bold text-white mb-4">
            최근에 얻은 스탬프
          </h2>

          <div className="flex gap-3 justify-center min-h-[120px] items-center">
            {recentStampState === 'loading' && (
              <span className="text-sm text-white/80">불러오는 중...</span>
            )}
            {recentStampState === 'error' && (
              <span className="text-sm text-white/80">
                불러오지 못했습니다.
              </span>
            )}
            {recentStampState === 'empty' && (
              <span className="text-sm text-white/80">
                아직 획득한 스탬프가 없습니다.
              </span>
            )}
            {recentStampState === 'success' &&
              recentStamps.map((stamp, index) => (
                <div
                  key={`${stamp.name}-${index}`}
                  className="w-30 h-30 bg-white rounded-lg border-2 border-[#A54545] flex items-center justify-center overflow-hidden shadow-md"
                  title={stamp.name}
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

      {/* 주변 관광지 */}
      <div className="flex-1 px-6 py-6 pb-24 relative z-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          주변 추천 관광지
        </h2>

        {nearbyPlaces.length ? (
          <div className="space-y-4">
            {nearbyPlaces.map((place, idx) => (
              <div
                key={place.id ?? idx}
                className="flex gap-5 p-3 bg-white rounded-xl hover:bg-gray-100 transition cursor-pointer shadow-md"
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
                    {(place.tags ?? []).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs text-[#A74242] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-[#A8A8A8]">
                    {place.distance && <span>{place.distance}</span>}
                    {place.rating !== undefined && (
                      <span>⭐ {place.rating}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
