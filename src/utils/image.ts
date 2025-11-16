/**
 * 이미지 URL을 Blob으로 변환하는 유틸리티 함수
 * @param imageUrl - 변환할 이미지 URL (data URL 또는 일반 URL)
 * @returns Blob 객체
 * @throws Error - 이미지 다운로드 실패 시
 */
import { toS3WebsiteUrl } from './s3';

export async function getImageBlob(imageUrl: string): Promise<Blob> {
  // data URL은 CORS 영향 없음
  if (imageUrl.startsWith('data:')) {
    const response = await fetch(imageUrl);
    return await response.blob();
  }

  // 1차: 원본 URL로 시도
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (res.ok) {
      return await res.blob();
    }
  } catch {
    // 네트워크/브라우저 CORS 차단 등
  }

  // 2차: S3 REST → CloudFront(Website) URL로 변환하여 재시도 (CORS 허용)
  try {
    const cdnUrl = toS3WebsiteUrl(imageUrl);
    if (cdnUrl && cdnUrl !== imageUrl) {
      const res2 = await fetch(cdnUrl, { mode: 'cors' });
      if (res2.ok) {
        return await res2.blob();
      }
    }
  } catch {
    // 여전히 실패 시 아래에서 에러 처리
  }

  throw new Error('이미지 다운로드 실패');
}

/**
 * Blob을 파일로 다운로드하는 유틸리티 함수
 * @param blob - 다운로드할 Blob 객체
 * @param filename - 다운로드될 파일명
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = blobUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

// s3 연결하면서 추가된 부분
/**
 * data URL을 File 객체로 변환하는 유틸리티 함수
 * @param dataUrl 변환할 data URL
 * @param fileName 생성될 파일명
 */
export async function dataUrlToFile(
  dataUrl: string,
  fileName: string
): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const mimeMatch = dataUrl.match(/^data:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : blob.type || 'image/png';
  return new File([blob], fileName, { type: mimeType });
}
