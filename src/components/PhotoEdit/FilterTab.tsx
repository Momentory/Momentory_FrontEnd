import Slider from '../common/Slider';
import { useEffect, useRef, useState } from 'react';

interface FilterTabProps {
  intensity: number;
  selectedFilter: string;
  onIntensityChange: (value: number) => void;
  onFilterChange: (filter: string) => void;
  previewImage?: string;
}

export default function FilterTab({
  intensity,
  selectedFilter,
  onIntensityChange,
  onFilterChange,
  previewImage = '/images/everland.jpg',
}: FilterTabProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftHint, setShowLeftHint] = useState(false);
  const [showRightHint, setShowRightHint] = useState(false);

  const filters = [
    {
      name: '원본',
      style: (_intensity: number) => 'none',
    },
    {
      name: '선명하게',
      style: (intensity: number) =>
        `contrast(${100 + (intensity / 100) * 20}%) saturate(${100 + (intensity / 100) * 20}%)`,
    },
    {
      name: '밝은',
      style: (intensity: number) =>
        `brightness(${100 + (intensity / 100) * 20}%)`,
    },
    {
      name: '어두운',
      style: (intensity: number) =>
        `brightness(${100 - (intensity / 100) * 30}%)`,
    },
    {
      name: '따뜻한',
      style: (intensity: number) =>
        `sepia(${(intensity / 100) * 30}%) saturate(${100 + (intensity / 100) * 15}%)`,
    },
    {
      name: '영화',
      style: (intensity: number) =>
        `sepia(${(intensity / 100) * 50}%) contrast(${100 + (intensity / 100) * 10}%)`,
    },
    {
      name: '모노',
      style: (intensity: number) => `grayscale(${intensity}%)`,
    },
    {
      name: '흑백',
      style: (intensity: number) =>
        `grayscale(100%) contrast(${100 + (intensity / 100) * 20}%)`,
    },
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateHints = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      // 약간의 여유값(threshold)을 두어 양끝에서는 그라디언트가 보이지 않도록 함
      const threshold = 12; // px
      const atStart = scrollLeft <= threshold;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - threshold;
      setShowLeftHint(!atStart);
      setShowRightHint(!atEnd);
    };

    // 초기 상태 및 리사이즈 대응
    updateHints();
    const onScroll = () => updateHints();
    el.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => updateHints();
    window.addEventListener('resize', onResize);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 강도 슬라이더 */}
      <Slider
        label="강도"
        value={intensity}
        onChange={onIntensityChange}
        min={0}
        max={100}
        step={1}
      />

      {/* 필터 슬라이더 (가로 스크롤) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          필터
        </label>
        <div className="relative">
          {/* 좌우 페이드 힌트 */}
          {showLeftHint && (
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-[5]"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              }}
            />
          )}
          {showRightHint && (
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-[5]"
              style={{
                background:
                  'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              }}
            />
          )}

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-3 pr-2 pl-2 filter-scrollbar"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              overscrollBehaviorX: 'contain',
              paddingLeft:
                selectedFilter === '원본' ? 'calc(8px + (80px * 0.05))' : '8px',
            }}
          >
            {filters.map((filter, index) => (
              <button
                key={filter.name}
                onClick={() => onFilterChange(filter.name)}
                className="flex flex-col items-center min-w-[80px] py-1"
                style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
              >
                <div
                  className={`relative w-20 h-20 rounded-lg transition-all ${
                    selectedFilter === filter.name
                      ? 'ring-2 ring-[#FF7070] scale-105'
                      : 'ring-1 ring-gray-200'
                  }`}
                  style={{
                    transformOrigin: index === 0 ? 'left center' : 'center',
                  }}
                >
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt={filter.name}
                      className="w-full h-full object-cover"
                      style={{ filter: filter.style(intensity) }}
                    />
                  </div>
                </div>
                <p
                  className={`text-xs text-center mt-2 transition-colors ${
                    selectedFilter === filter.name
                      ? 'text-[#FF7070] font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {filter.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
