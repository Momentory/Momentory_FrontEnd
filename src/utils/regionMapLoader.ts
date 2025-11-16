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

// 지역명을 SVG 파일명으로 매핑 (영어 파일명 사용)
const REGION_TO_FILENAME: Record<string, string> = {
  수원시: 'suwon',
  고양시: 'goyang',
  용인시: 'yongin',
  성남시: 'seongnam',
  부천시: 'bucheon',
  안산시: 'ansan',
  안양시: 'anyang',
  평택시: 'pyeongtaek',
  시흥시: 'siheung',
  김포시: 'gimpo',
  광명시: 'gwangmyeong',
  광주시: 'gwangju',
  군포시: 'gunpo',
  하남시: 'hanam',
  오산시: 'osan',
  이천시: 'icheon',
  안성시: 'anseong',
  의왕시: 'uiwang',
  과천시: 'gwacheon',
  구리시: 'guri',
  남양주시: 'namyangju',
  의정부시: 'uijeongbu',
  양주시: 'yangju',
  동두천시: 'dongducheon',
  포천시: 'pocheon',
  연천군: 'yeoncheon',
  가평군: 'gapyeong',
  양평군: 'yangpyeong',
  화성시: 'hwaseong',
  파주시: 'paju',
  여주시: 'yeoju',
};

// Vite의 import.meta.glob을 사용하여 모든 SVG 파일을 로드
// eager: true는 즉시 로드, as: 'url'은 파일 URL을 반환
const svgModules = import.meta.glob<string>(
  '/src/assets/maps/*.svg',
  { eager: true, as: 'url' }
);

// 파일명을 키로 하는 맵 생성
const svgPathMap: Record<string, string> = {};
Object.keys(svgModules).forEach((path) => {
  // '/src/assets/maps/수원.svg' -> '수원'
  const filename = path.split('/').pop()?.replace('.svg', '') || '';
  svgPathMap[filename] = svgModules[path];
});

// 개발 환경에서 디버깅용 (배포 시 확인 가능)
if (import.meta.env.DEV) {
  console.log('🗺️ SVG Path Map:', svgPathMap);
  console.log('📍 Loaded regions:', Object.keys(svgPathMap));
}

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

  return svgPathMap[filename] || null;
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
