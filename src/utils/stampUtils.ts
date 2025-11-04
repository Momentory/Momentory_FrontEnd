/**
 * 경기도 31개 시/군 목록 및 스탬프 매핑
 */

// 경기도 시/군 목록
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

/**
 * 지역명으로 스탬프 이미지 경로 가져오기
 * @param regionName 지역명 (예: "하남시")
 * @returns 스탬프 이미지 경로
 */
export function getStampImagePath(regionName: string): string {
  // 지역명 정규화 (예: "하남시" -> "하남시")
  const normalizedName = regionName.replace('경기도', '').trim();

  // public/stamps 폴더에 있는 스탬프 이미지 경로 반환
  // 예: /stamps/하남시.svg
  return `/stamps/${normalizedName}.svg`;
}

/**
 * 지역명이 유효한 경기도 시/군인지 확인
 * @param regionName 지역명
 * @returns 유효한 지역이면 true
 */
export function isValidGyeonggiRegion(regionName: string): boolean {
  const normalizedName = regionName.replace('경기도', '').trim();
  return GYEONGGI_REGIONS.some((region) => normalizedName.includes(region));
}

/**
 * 지역명에서 시/군 이름만 추출 (예: "경기도 하남시" -> "하남시")
 * @param regionName 지역명
 * @returns 시/군 이름
 */
export function extractRegionName(regionName: string): string {
  const normalizedName = regionName.replace('경기도', '').trim();
  const matched = GYEONGGI_REGIONS.find((region) =>
    normalizedName.includes(region)
  );
  return matched || normalizedName;
}

