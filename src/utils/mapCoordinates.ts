/**
 * GPS 좌표를 경기도 지도 상의 퍼센트 위치로 변환합니다.
 * 기존 마커 데이터를 기준으로 선형 변환합니다.
 *
 * 경기도 대략적 범위 (기존 마커 기준 추정):
 * - 위도: 36.9 ~ 38.0 (남→북)
 * - 경도: 126.5 ~ 127.7 (서→동)
 */

// 경기도 지도 범위 (추정)
const GYEONGGI_BOUNDS = {
  minLat: 36.9,
  maxLat: 38.0,
  minLng: 126.5,
  maxLng: 127.7,
};

/**
 * GPS 좌표를 지도 상의 퍼센트 위치로 변환
 * @param lat 위도
 * @param lng 경도
 * @returns { top: string, left: string } 퍼센트 문자열 (예: "50%", "60%")
 */
export function gpsToMapPosition(
  lat: number,
  lng: number
): { top: string; left: string } {
  // 위도 → top (남쪽이 아래, 북쪽이 위)
  // 지도에서 top이 작을수록 위쪽(북쪽)이므로 역변환 필요
  const latRatio =
    (lat - GYEONGGI_BOUNDS.minLat) /
    (GYEONGGI_BOUNDS.maxLat - GYEONGGI_BOUNDS.minLat);
  // 0% = 북쪽, 100% = 남쪽이므로 1 - latRatio
  const topPercent = (1 - latRatio) * 100;

  // 경도 → left (서쪽이 왼쪽, 동쪽이 오른쪽)
  const lngRatio =
    (lng - GYEONGGI_BOUNDS.minLng) /
    (GYEONGGI_BOUNDS.maxLng - GYEONGGI_BOUNDS.minLng);
  const leftPercent = lngRatio * 100;

  // 범위 제한 (0~100%)
  const clampedTop = Math.max(0, Math.min(100, topPercent));
  const clampedLeft = Math.max(0, Math.min(100, leftPercent));

  return {
    top: `${clampedTop.toFixed(2)}%`,
    left: `${clampedLeft.toFixed(2)}%`,
  };
}

/**
 * 주소 문자열에서 시/군 이름을 추출합니다.
 * @param address 주소 문자열
 * @returns 시/군 이름 (예: "부천시", "서울시")
 */
export function extractCityName(address: string): string | null {
  // 한국어 주소에서 시/군 추출
  const cityMatch = address.match(/(\S+시|\S+군|\S+구)/);
  if (cityMatch) {
    return cityMatch[1];
  }
  return null;
}

