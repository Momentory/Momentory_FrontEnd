import * as htmlToImage from 'html-to-image';

/**
 * HTML 요소를 이미지로 캡처
 * @param element 캡처할 HTML 요소
 * @param options html-to-image 옵션
 * @returns data URL
 */
export async function captureElement(
  element: HTMLElement,
  options?: {
    backgroundColor?: string;
    quality?: number;
  }
): Promise<string> {
  const defaultOptions = {
    backgroundColor: '#ffffff',
    quality: 1,
    style: {
      transform: 'none', // scale, zoom 영향 제거
      zoom: '1',
    },
    ...options,
  };

  try {
    // 보이는 비율 그대로 캡처
    const dataUrl = await htmlToImage.toPng(element, defaultOptions);
    return dataUrl;
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
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context 생성 실패'));
        return;
      }

      // 원본 이미지 그리기
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

      // 텍스트 위치
      const padding = fontSize * 0.5;
      const x = img.width - padding;
      const y = img.height - padding;

      // 외곽선 그림자 효과
      ctx.fillStyle = '#AAAAAA';
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          if (i !== 0 || j !== 0) {
            ctx.fillText(today, x + i, y + j);
          }
        }
      }

      // 본문 텍스트 (흰색)
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
  });

  // 날짜 추가
  return addDateToImage(imageDataUrl);
}
