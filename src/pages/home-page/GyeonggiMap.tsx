import { useEffect, useRef } from 'react';
// 👇 1. SVG 파일을 React 컴포넌트처럼 불러옵니다. (Vite는 '?react'를 붙이면 됩니다)
import MapSvg from '../../assets/gyeonggi-map.svg?react'; 

// 2. props의 타입을 정의합니다. 
//    { '부천시': '#FFB7B7', '수원시': '#ABCDEF' } 같은 객체입니다.
interface GyeonggiMapProps {
  colors: Record<string, string>;
}

export default function GyeonggiMap({ colors }: GyeonggiMapProps) {
  // 3. SVG DOM에 직접 접근하기 위해 ref를 만듭니다.
  const svgRef = useRef<SVGSVGElement>(null);

  // 4. colors prop이 바뀔 때마다 SVG 색을 칠하는 로직
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return; // SVG가 없으면 중단

    // 5. API로 받은 모든 색깔(colors)을 순회합니다.
    Object.entries(colors).forEach(([cityName, color]) => {
      // 6. SVG 안에서 <g id="부천시"> 같은 그룹(g)을 찾습니다.
      const groupElement = svgElement.querySelector(`#${cityName}`);
      
      if (groupElement) {
        // 7. 우리가 본 대로, <g> 안의 <rect>를 찾아야 합니다.
        const rectElement = groupElement.querySelector('rect');
        
        // 8. rect를 찾았으면, fill 속성을 API가 준 색으로 덮어씁니다!
        if (rectElement) {
          rectElement.setAttribute('fill', color);
        }
      }
    });
  }, [colors]); // 'colors' prop이 바뀔 때마다 이 로직이 재실행됩니다.

  // 9. SVG를 렌더링하고, ref를 연결해줍니다.
  return (
    <div className="relative flex justify-center">
       {/* SVG 파일의 실제 경로를 import 경로에 맞게 수정해주세요. 
         (예: ../../assets/icons/gyeonggi-map.svg?react)
       */}
      <MapSvg ref={svgRef} className="w-[220px] h-auto" />
    </div>
  );
}