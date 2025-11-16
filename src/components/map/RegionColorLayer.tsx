// 방문한 지역의 색상 오버레이 표시
import { memo, useMemo } from 'react';
import { getVisitedRegionsWithColors } from '../../utils/regionMapLoader';

interface RegionColorLayerProps {
  colorMap: Record<string, string>; // { "수원시": "#FF5733", ... }
}

const RegionColorLayer = memo(function RegionColorLayer({
  colorMap
}: RegionColorLayerProps) {
  const visitedRegions = useMemo(
    () => getVisitedRegionsWithColors(colorMap),
    [colorMap]
  );

  if (visitedRegions.length === 0) {
    return null;
  }

  return (
    <>
      {visitedRegions.map(({ name, color, svgPath }) => (
        <div
          key={name}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundColor: color,
            opacity: 0.4,
            mixBlendMode: 'multiply',
            maskImage: `url(${svgPath})`,
            WebkitMaskImage: `url(${svgPath})`,
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: '0 0',
            WebkitMaskPosition: '0 0',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />
      ))}
    </>
  );
});

export default RegionColorLayer;
