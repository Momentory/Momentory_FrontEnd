import exifr from 'exifr';

export interface GPSLocation {
  lat: number;
  lng: number;
}

/**
 * 이미지에서 GPS 좌표를 추출합니다.
 * @param imageSrc 이미지 파일 또는 Data URL
 * @returns GPS 좌표 또는 null (GPS 정보가 없을 경우)
 */
export async function extractGPSFromImage(
  imageSrc: string | File
): Promise<GPSLocation | null> {
  try {
    let file: File;

    // Data URL인 경우 File 객체로 변환
    if (typeof imageSrc === 'string' && imageSrc.startsWith('data:')) {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      file = new File([blob], 'image.jpg', { type: blob.type });
    } else if (typeof imageSrc === 'string') {
      // 일반 URL인 경우
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      file = new File([blob], 'image.jpg', { type: blob.type });
    } else {
      file = imageSrc;
    }

    // EXIF 데이터에서 GPS 정보 추출
    const exifData = await exifr.gps(file);

    if (exifData && exifData.latitude && exifData.longitude) {
      return {
        lat: exifData.latitude,
        lng: exifData.longitude,
      };
    }

    return null;
  } catch (error) {
    console.error('GPS 정보 추출 실패:', error);
    return null;
  }
}

/**
 * GPS 좌표를 주소로 변환합니다 (역지오코딩).
 * @param lat 위도
 * @param lng 경도
 * @returns 주소 문자열 또는 null
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    // Kakao Maps API 또는 Google Maps Geocoding API를 사용할 수 있습니다.
    // 여기서는 간단한 예시로 구현 (실제 API 키가 필요합니다)
    // TODO: 실제 지오코딩 API 연동
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'Momentory App',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.display_name || null;
    }

    return null;
  } catch (error) {
    console.error('역지오코딩 실패:', error);
    return null;
  }
}
