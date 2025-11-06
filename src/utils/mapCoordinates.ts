//GPS 좌표를 경기도 지도 상의 퍼센트 위치로 변환

const GYEONGGI_BOUNDS = {
  minLat: 36.7,
  maxLat: 38.2,
  minLng: 126.3,
  maxLng: 127.9,
};

const OFFSET_TOP = 7.56;
const OFFSET_LEFT = 6.875;

// [lat, lng, topOffset, leftOffset]
const KNOWN_CITY_POSITIONS: Array<[number, number, number, number]> = [
  [37.5034, 126.766, 0, 0], // 부천시 (기준점)
  [37.1995, 126.8319, 0, 0], // 화성시 (기본 변환 사용)
  [37.8315, 127.5093, 7, -15], // 가평군
  [37.42, 127.1265, 0, -5], // 성남시
  [38.033884, 127.071054, 5, -10], // 연천군
  [37.01, 127.27, -10, -5], // 안성시
  [37.2411, 127.1776, -3, -3], // 용인시
  [37.6367, 127.2165, 0, -7], // 남양주시
  [36.992, 127.1127, -10, -11], // 평택시
  [37.892406, 127.052184, 6, -4], // 동두천시
];

// 기준점과 일치하는 GPS 좌표의 보정값 반환
function getKnownCityPosition(
  lat: number,
  lng: number
): [number, number] | null {
  const threshold = 0.001; // 약 100m 이내
  for (const [
    knownLat,
    knownLng,
    topOffset,
    leftOffset,
  ] of KNOWN_CITY_POSITIONS) {
    if (
      Math.abs(lat - knownLat) < threshold &&
      Math.abs(lng - knownLng) < threshold
    ) {
      // (0, 0)은 보정값이 없는 기준점이므로 null 반환 (다른 기준점 찾기)
      if (topOffset === 0 && leftOffset === 0) {
        return null;
      }
      return [topOffset, leftOffset];
    }
  }
  return null;
}

// 가장 가까운 기준점을 찾아 거리에 따라 보정값 보간
function estimateCorrectionFromNearestCity(
  lat: number,
  lng: number
): [number, number] {
  let minDistance = Infinity;
  let nearestOffset: [number, number] = [0, 0];

  for (const [
    knownLat,
    knownLng,
    topOffset,
    leftOffset,
  ] of KNOWN_CITY_POSITIONS) {
    const latDiff = lat - knownLat;
    const lngDiff = lng - knownLng;
    // 경도에 가중치(1.3)를 주어 거리 계산
    const distance = Math.sqrt(
      latDiff * latDiff + lngDiff * 1.3 * (lngDiff * 1.3)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestOffset = [topOffset, leftOffset];
    }
  }

  const maxDistance = 0.5; // 최대 보정 적용 거리
  const weight = Math.max(0, 1 - minDistance / maxDistance);

  return [nearestOffset[0] * weight, nearestOffset[1] * weight];
}

/**
 * GPS 좌표를 지도 퍼센트 위치로 변환 (하이브리드 보정)
 * @param lat 위도
 * @param lng 경도
 * @returns { top: string, left: string }
 */
export function gpsToMapPosition(
  lat: number,
  lng: number
): { top: string; left: string } {
  const knownPosition = getKnownCityPosition(lat, lng);

  // 기본 선형 변환
  const latRatio =
    (lat - GYEONGGI_BOUNDS.minLat) /
    (GYEONGGI_BOUNDS.maxLat - GYEONGGI_BOUNDS.minLat);
  let baseTopPercent = (1 - latRatio) * 100; // 위도는 북쪽이 0%
  baseTopPercent += OFFSET_TOP;

  const lngRatio =
    (lng - GYEONGGI_BOUNDS.minLng) /
    (GYEONGGI_BOUNDS.maxLng - GYEONGGI_BOUNDS.minLng);
  let baseLeftPercent = lngRatio * 100;
  baseLeftPercent += OFFSET_LEFT;

  // 보정 적용
  let topPercent: number;
  let leftPercent: number;

  if (knownPosition) {
    // 1. 기준점과 일치하는 경우: 해당 보정값 적용
    topPercent = baseTopPercent + knownPosition[0];
    leftPercent = baseLeftPercent + knownPosition[1];
  } else {
    // 2. 기준점과 일치하지 않는 경우: 가장 가까운 기준점 기준으로 보간
    const [nearestTopOffset, nearestLeftOffset] =
      estimateCorrectionFromNearestCity(lat, lng);

    topPercent = baseTopPercent + nearestTopOffset;
    leftPercent = baseLeftPercent + nearestLeftOffset;
  }

  // 범위 제한 (0~100%)
  const clampedTop = Math.max(0, Math.min(100, topPercent));
  const clampedLeft = Math.max(0, Math.min(100, leftPercent));

  return {
    top: `${clampedTop.toFixed(2)}%`,
    left: `${clampedLeft.toFixed(2)}%`,
  };
}

export function extractCityName(address: string): string | null {
  const cityMatch = address.match(/(\S+시|\S+군|\S+구)/);
  if (cityMatch) {
    return cityMatch[1];
  }
  return null;
}
