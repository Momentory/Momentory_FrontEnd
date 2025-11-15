// 경기도 28개 시/군 지역 SVG 파일 동적 로딩
export const GYEONGGI_REGIONS = [
  '수원시',
  '용인시',
  '부천시',
  '광명시',
  '의정부시',
  '고양시',
  '남양주시',
  '화성시',
  '안양시',
  '평택시',
  '시흥시',
  '김포시',
  '안산시',
  '광주시',
  '군포시',
  '이천시',
  '오산시',
  '하남시',
  '파주시',
  '의왕시',
  '양주시',
  '구리시',
  '안성시',
  '포천시',
  '여주시',
  '양평군',
  '가평군',
  '연천군',
] as const;

export type RegionName = (typeof GYEONGGI_REGIONS)[number];

// 지역명을 SVG 파일명으로 매핑
// 파일명 형식이 일관되지 않아서 매핑 필요
const REGION_TO_FILENAME: Record<string, string> = {
  수원시: '수원',
  고양시: '고양시',
  용인시: '용인',
  성남시: '성남',
  부천시: '부천',
  안산시: '안산',
  안양시: '안양',
  평택시: '평택',
  시흥시: '시흥',
  김포시: '김포시',
  광명시: '광명',
  광주시: '광주',
  군포시: '군포',
  하남시: '하남',
  오산시: '오산',
  이천시: '이천',
  안성시: '안성',
  의왕시: '의왕',
  과천시: '과천',
  구리시: '구리',
  남양주시: '남양주',
  의정부시: '의정부',
  양주시: '양주',
  동두천시: '동두천',
  포천시: '포천',
  연천군: '연천',
  가평군: '가평',
  양평군: '양평',
  화성시: '화성',
  파주시: '파주시',
  여주시: '여주',
  의왕: '의왕',
};

/**
 * 지역명으로 SVG 파일 경로 가져오기
 * @param regionName 지역명 (예: "수원시")
 * @returns SVG 파일 경로 또는 null
 */
export function getRegionSvgPath(regionName: string): string | null {
  const filename = REGION_TO_FILENAME[regionName];

  if (!filename) {
    return null;
  }

  // Vite의 동적 import를 위한 경로
  // assets/maps/ 폴더에 지역명.svg 형식으로 파일이 있음
  try {
    // Vite의 정적 분석을 위해 명시적 경로 사용
    return `/src/assets/maps/${filename}.svg`;
  } catch {
    return null;
  }
}

/**
 * 여러 지역의 SVG 경로를 한번에 가져오기
 */
export function getRegionsSvgPaths(
  regionNames: string[]
): Record<string, string> {
  const paths: Record<string, string> = {};

  for (const name of regionNames) {
    const path = getRegionSvgPath(name);
    if (path) {
      paths[name] = path;
    }
  }

  return paths;
}

/**
 * 방문한 지역에 색상 매핑
 * @param colorMap 지역별 색상 맵 (예: { "수원시": "#FF5733" })
 * @returns 지역명과 색상 쌍의 배열
 */
export function getVisitedRegionsWithColors(
  colorMap: Record<string, string>
): Array<{ name: string; color: string; svgPath: string }> {
  return Object.entries(colorMap)
    .map(([name, color]) => {
      const svgPath = getRegionSvgPath(name);
      return svgPath ? { name, color, svgPath } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}
