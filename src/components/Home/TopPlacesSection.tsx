import { useState, useEffect, useRef } from 'react';
import PlaceSkeleton from './PlaceSkeleton';

interface TopPlacesSectionProps {
  topPlaces: any[];
  isLoading: boolean;
}

const TopPlacesSection = ({ topPlaces, isLoading }: TopPlacesSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topPlaces.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topPlaces.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [topPlaces.length]);

  useEffect(() => {
    if (scrollContainerRef.current && topPlaces.length > 0) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;

      const scrollPosition = containerWidth * currentIndex;

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [currentIndex, topPlaces.length]);

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="mt-10 mb-24 overflow-hidden">
      <h2 className="text-2xl font-bold mb-3 px-6">이번 주 추천 장소</h2>

      {isLoading ? (
        <div className="px-6">
          <PlaceSkeleton />
        </div>
      ) : topPlaces.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          추천 여행지가 없습니다.
        </div>
      ) : (
        <>
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-hidden"
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          >
            {topPlaces.map((place, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full px-6"
                style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
              >
                <div className="bg-white shadow-md overflow-hidden border-[3px] border-[#F2E8E8] hover:shadow-lg transition-all duration-300 p-5">
                <img
                  src={place.imageUrl ?? "/images/default.png"}
                  alt={place.name}
                  className="w-full h-[200px] border-[3px] border-[#CAA1A1]"
                />

                <div className="flex justify-between items-start mt-3.5">
                  <p className="text-xl font-semibold text-black">
                    {place.name}
                  </p>
              
                </div>

                <div className="flex justify-between items-end mt-3">
                  <div className="flex items-center gap-1">
                    <span
                      className="font-bold text-[13px] text-[#AE7C7C]"
                    >
                      {place.address}
                    </span>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-3">
            {topPlaces.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleIndicatorClick(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'bg-[#ff7070] w-6'
                    : 'bg-gray-300'
                }`}
                aria-label={`슬라이드 ${idx + 1}로 이동`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default TopPlacesSection;
