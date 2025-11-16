// 경기도 31개 시·군 & 스탬프 유틸

export const GYEONGGI_REGIONS = [
  '수원시',
  '고양시',
  '용인시',
  '성남시',
  '부천시',
  '안산시',
  '안양시',
  '평택시',
  '시흥시',
  '김포시',
  '광명시',
  '광주시',
  '군포시',
  '하남시',
  '오산시',
  '이천시',
  '안성시',
  '의왕시',
  '과천시',
  '구리시',
  '남양주시',
  '의정부시',
  '양주시',
  '동두천시',
  '포천시',
  '연천군',
  '가평군',
  '양평군',
  '화성시',
  '파주시',
  '여주시',
] as const;

export type GyeonggiRegion = (typeof GYEONGGI_REGIONS)[number];

/* 지역명 정규화 */
function normalizeRegionName(name: string): string {
  return name.replace('경기도', '').trim();
}

/* 스탬프 이미지 경로 */
export function getStampImagePath(regionName: string): string {
  const name = normalizeRegionName(regionName);
  return `/stamps/${name}.svg`;
}

export function getCulturalStampImagePath(stampName: string): string {
  // 파일명 규칙: 공백 제거 + 일부 예외 매핑
  const trimmed = stampName.trim();
  let fileKey = trimmed.replace(/\s+/g, '');

  // 예외: 서버 이름 → 실제 파일명 매핑
  const fileNameMap: Record<string, string> = {
    '동두천계곡': '동두천시계곡',
    '부천만화박물관': '한국만화박물관',
    '만화박물관': '한국만화박물관',
    '한강유채꽃': '구리시한강유채꽃',
    '물의정원': '남양주시물의정원',
    '서울대공원': '과천서울대공원',
    '안양천': '안양천제방벚꽃길',
    '행복로': '의정부행복로',
  };

  if (fileNameMap[fileKey]) {
    fileKey = fileNameMap[fileKey];
  }

  return `/cultural-stamps/${fileKey}.svg`;
}

/* 경기도 시·군 여부 체크 */
export function isValidGyeonggiRegion(regionName: string): boolean {
  const name = normalizeRegionName(regionName);
  return GYEONGGI_REGIONS.some((region) => name.includes(region));
}

/* 지역명에서 시·군만 추출 */
export function extractRegionName(regionName: string): string {
  const name = normalizeRegionName(regionName);
  return GYEONGGI_REGIONS.find((region) => name.includes(region)) ?? name;
}

/* 문화 스탬프 매핑 */
type CulturalStampMapping = {
  keywords: string[];
  stampName: string;
};

const CULTURAL_STAMP_MAPPINGS: CulturalStampMapping[] = [
  { keywords: ['수원 화성', '수원화성', '유네스코'], stampName: '수원화성' },
  { keywords: ['평택항'], stampName: '평택항' },
  { keywords: ['누에섬 등대전망대', '탄도항누에섬', '안산누에섬'], stampName: '안산누에섬' },
  { keywords: ['킨텍스', '고양킨텍스'], stampName: '고양킨텍스' },
  { keywords: ['서울대공원', '과천서울대공원'], stampName: '서울대공원' },
  { keywords: ['왕방계곡', '동두천계곡'], stampName: '동두천계곡' },
  { keywords: ['남한산성 행궁', '남한산성', '성남남한산성'], stampName: '성남남한산성' },
  { keywords: ['부천만화박물관', '만화박물관', '한국만화박물관'], stampName: '부천만화박물관' },
  { keywords: ['광명동굴'], stampName: '광명동굴' },
  { keywords: ['한강유채꽃', '구리시한강유채꽃'], stampName: '한강유채꽃' },
  { keywords: ['물의정원', '남양주시물의정원'], stampName: '물의정원' },
  { keywords: ['안양천', '안양천제방벚꽃길'], stampName: '안양천' },
  { keywords: ['오산독산성'], stampName: '오산독산성' },
  { keywords: ['행복로', '의정부행복로'], stampName: '행복로' },
];

/* 관광지명 → 표준 스탬프명 매핑 */
export function mapCulturalSpotName(spotName: string): {
  canonicalName: string;
  stampDisplayName: string;
  isSupported: boolean;
} {
  const name = spotName?.trim();
  if (!name) {
    return { canonicalName: '', stampDisplayName: '', isSupported: false };
  }

  const matched = CULTURAL_STAMP_MAPPINGS.find((mapping) =>
    mapping.keywords.some((keyword) => name.includes(keyword))
  );

  if (!matched) {
    return { canonicalName: name, stampDisplayName: name, isSupported: false };
  }

  return {
    canonicalName: matched.stampName,
    stampDisplayName: matched.stampName,
    isSupported: true,
  };
}
