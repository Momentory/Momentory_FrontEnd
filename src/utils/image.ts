/**
 * 이미지 URL을 Blob으로 변환하는 유틸리티 함수
 * @param imageUrl - 변환할 이미지 URL (data URL 또는 일반 URL)
 * @returns Blob 객체
 * @throws Error - 이미지 다운로드 실패 시
 */
export async function getImageBlob(imageUrl: string): Promise<Blob> {
  if (imageUrl.startsWith('data:')) {
    const response = await fetch(imageUrl);
    return await response.blob();
  } else {
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) {
      throw new Error('이미지 다운로드 실패');
    }
    return await response.blob();
  }
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
