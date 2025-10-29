import html2canvas from 'html2canvas';

/**
 * HTML 요소를 이미지로 캡처
 * @param element 캡처할 HTML 요소
 * @param options html2canvas 옵션
 * @returns data URL
 */
export async function captureElement(
  element: HTMLElement,
  options?: {
    backgroundColor?: string;
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  }
): Promise<string> {
  const defaultOptions = {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    ...options,
  };

  try {
    const canvas = await html2canvas(element, defaultOptions);
    return canvas.toDataURL('image/png', 1);
  } catch (error) {
    console.error('캡처 실패:', error);
    throw new Error('지도 캡처 실패');
  }
}

/**
 * 지도 요소를 캡처
 * @param mapElementId 캡처할 지도 요소 ID
 * @returns data URL
 */
export async function captureMap(mapElementId: string): Promise<string> {
  const mapEl = document.getElementById(mapElementId);
  if (!mapEl) throw new Error('지도 요소 없음');

  return captureElement(mapEl, { backgroundColor: '#f9fafb', scale: 2 });
}
