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
  const name = stampName.trim();
  return `/cultural-stamps/${name}.svg`;
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
  { keywords: ['수원 화성', '유네스코'], stampName: '수원 화성' },
  { keywords: ['평택항'], stampName: '평택항' },
  { keywords: ['누에섬 등대전망대', '탄도항누에섬'], stampName: '안산 누에섬' },
  { keywords: ['킨텍스'], stampName: '고양 킨텍스' },
  { keywords: ['서울대공원'], stampName: '과천 서울대공원' },
  { keywords: ['왕방계곡'], stampName: '동두천 계곡' },
  { keywords: ['남한산성 행궁'], stampName: '성남 남한산성' },
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
