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
 * 캡처된 이미지에 날짜 텍스트 추가
 * @param imageDataUrl 원본 이미지 data URL
 * @returns 날짜가 추가된 이미지 data URL
 */
async function addDateToImage(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context 생성 실패'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      // 날짜 텍스트 설정
      const today = new Intl.DateTimeFormat('fr-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());

      const fontSize = Math.floor(img.height * 0.035);
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      const padding = fontSize * 0.5;
      const x = img.width - padding;
      const y = img.height - padding;

      ctx.fillStyle = '#AAAAAA';
      ctx.lineWidth = 4;
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          if (i !== 0 || j !== 0) {
            ctx.fillText(today, x + i, y + j);
          }
        }
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(today, x, y);

      resolve(canvas.toDataURL('image/png', 1));
    };
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = imageDataUrl;
  });
}

/**
 * 지도 요소를 캡처
 * @param mapElementId 캡처할 지도 요소 ID
 * @returns data URL (날짜 포함)
 */
export async function captureMap(mapElementId: string): Promise<string> {
  const mapEl = document.getElementById(mapElementId);
  if (!mapEl) throw new Error('지도 요소 없음');

  const imageDataUrl = await captureElement(mapEl, {
    backgroundColor: '#f9fafb',
    scale: 2,
  });

  return addDateToImage(imageDataUrl);
}
