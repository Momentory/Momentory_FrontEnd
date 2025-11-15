//GPS 좌표를 경기도 지도 상의 퍼센트 위치로 변환

const GYEONGGI_BOUNDS = {
  minLat: 36.7,
  maxLat: 38.2,
  minLng: 126.3,
  maxLng: 127.9,
};

const OFFSET_TOP = 7.56;
const OFFSET_LEFT = 6.875;

// 각 지역의 지도 상 위치 (transform 적용된 좌표계 기준)
// 지도 컨테이너: translate(-30px, -15px) scale(1.25) 적용됨
export const REGION_MAP_POSITIONS: Record<
  string,
  { top: string; left: string }
> = {
  // 북부 지역 - 부천/성남 기준 위쪽
  연천군: { top: '20%', left: '50%' },
  동두천시: { top: '39%', left: '50%' },
  포천시: { top: '28%', left: '67%' },
  파주시: { top: '32%', left: '27%' },
  양주시: { top: '35%', left: '50%' },
  의정부시: { top: '40%', left: '54%' },

  // 중북부 지역 - 부천 위쪽/왼쪽
  김포시: { top: '43%', left: '20%' },
  고양시: { top: '46%', left: '34%' },
  가평군: { top: '44%', left: '67%' }, //기준점 5 

  // 중앙 지역 - 성남 주변
  남양주시: { top: '48%', left: '64%' },
  구리시: { top: '51%', left: '57%' },
  하남시: { top: '54%', left: '62%' },
  양평군: { top: '58%', left: '87%' },
  광명시: { top: '54%', left: '39%' },
  부천시: { top: '53%', left: '36%' },  // 기준점 1
  성남시: { top: '56%', left: '53%' },  // 기준점 2
  광주시: { top: '59%', left: '70%' },

  // 중남부 지역 - 안양 주변
  과천시: { top: '58%', left: '50%' },
  안양시: { top: '56%', left: '43%' },  // 기준점 3
  의왕시: { top: '60%', left: '48%' },
  시흥시: { top: '59%', left: '32%' },
  군포시: { top: '61%', left: '45%' },
  안산시: { top: '63%', left: '30%' },
  수원시: { top: '60%', left: '47%' }, //기준점 4
  용인시: { top: '65%', left: '59%' },

  // 남부 지역 - 수원 아래
  화성시: { top: '70%', left: '38%' },
  오산시: { top: '72%', left: '49%' },
  이천시: { top: '62%', left: '69%' },
  여주시: { top: '76%', left: '87%' },
  평택시: { top: '79%', left: '45%' },
  안성시: { top: '82%', left: '59%' },
};

// GPS 좌표 (참고용 - 백엔드와의 통신에만 사용)
export const REGION_REPRESENTATIVE_COORDS: Record<
  string,
  { lat: number; lng: number }
> = {
  수원시: { lat: 37.2636, lng: 127.0286 },
  고양시: { lat: 37.6584, lng: 126.832 },
  용인시: { lat: 37.2411, lng: 127.1776 },
  성남시: { lat: 37.4201, lng: 127.1262 },
  부천시: { lat: 37.5034, lng: 126.766 },
  안산시: { lat: 37.3219, lng: 126.8309 },
  안양시: { lat: 37.3943, lng: 126.9568 },
  평택시: { lat: 36.992, lng: 127.1127 },
  시흥시: { lat: 37.3804, lng: 126.8028 },
  김포시: { lat: 37.6153, lng: 126.7156 },
  광명시: { lat: 37.4785, lng: 126.8644 },
  광주시: { lat: 37.4292, lng: 127.2551 },
  군포시: { lat: 37.3617, lng: 126.9352 },
  하남시: { lat: 37.5393, lng: 127.2147 },
  오산시: { lat: 37.1498, lng: 127.0773 },
  이천시: { lat: 37.2719, lng: 127.4351 },
  안성시: { lat: 37.0079, lng: 127.2797 },
  의왕시: { lat: 37.3449, lng: 126.9684 },
  과천시: { lat: 37.4292, lng: 126.9879 },
  구리시: { lat: 37.5943, lng: 127.1296 },
  남양주시: { lat: 37.6367, lng: 127.2165 },
  의정부시: { lat: 37.7382, lng: 127.0339 },
  양주시: { lat: 37.7853, lng: 127.0456 },
  동두천시: { lat: 37.9032, lng: 127.0604 },
  포천시: { lat: 38.0314, lng: 127.2003 },
  연천군: { lat: 38.0964, lng: 127.0746 },
  가평군: { lat: 37.8315, lng: 127.5093 },
  양평군: { lat: 37.4914, lng: 127.4874 },
  화성시: { lat: 37.1995, lng: 126.8319 },
  파주시: { lat: 37.7599, lng: 126.7801 },
  여주시: { lat: 37.2975, lng: 127.6377 },
};

// [lat, lng, topOffset, leftOffset]
const KNOWN_CITY_POSITIONS: Array<[number, number, number, number]> = [
  [37.5034, 126.766, 0, 0], // 부천시 (기준점)
  [37.1995, 126.8319, 0, 0], // 화성시 (기본 변환 사용)
  [37.8315, 127.5093, 7, -15], // 가평군
  [37.42, 127.1265, -1, -3], // 성남시
  [38.033884, 127.071054, 5, -10], // 연천군
  [37.01, 127.27, -10, -5], // 안성시
  [37.2411, 127.1776, -3, -3], // 용인시
  [37.6367, 127.2165, 0, -7], // 남양주시
  [36.992, 127.1127, -10, -11], // 평택시
  [37.9032, 127.0604, 6, -5], // 동두천시
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

/**
 * 지역명으로 지도 상의 위치 가져오기
 * @param regionName 지역명 (예: "부천시")
 * @returns 지도 상의 top, left 퍼센트 위치
 */
export function getRegionMapPosition(
  regionName: string
): { top: string; left: string } | null {
  return REGION_MAP_POSITIONS[regionName] || null;
}

export function extractCityName(address: string): string | null {
  const cityMatch = address.match(/(\S+시|\S+군|\S+구)/);
  if (cityMatch) {
    return cityMatch[1];
  }
  return null;
}
