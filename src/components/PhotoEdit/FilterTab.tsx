import Slider from '../common/Slider';
import { useRef } from 'react';

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
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {filters.map((filter, _index) => (
            <button
              key={filter.name}
              onClick={() => onFilterChange(filter.name)}
              className="flex flex-col items-center min-w-[80px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div
                className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                  selectedFilter === filter.name
                    ? 'ring-2 ring-[#FF7070] scale-105'
                    : 'ring-1 ring-gray-200'
                }`}
              >
                <img
                  src={previewImage}
                  alt={filter.name}
                  className="w-full h-full object-cover"
                  style={{ filter: filter.style(intensity) }}
                />
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
  );
}
