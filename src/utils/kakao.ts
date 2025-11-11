const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js';

declare global {
  interface Window {
    Kakao: any;
  }
}

let kakaoInitializer: Promise<typeof window.Kakao> | null = null;

export async function getKakao(): Promise<typeof window.Kakao> {
  if (typeof window === 'undefined') {
    throw new Error('브라우저 환경에서만 카카오 공유를 사용할 수 있습니다.');
  }

  if (window.Kakao?.isInitialized?.()) {
    return window.Kakao;
  }

  if (!kakaoInitializer) {
    kakaoInitializer = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${KAKAO_SDK_URL}"]`
      );

      const handleReady = () => {
        const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
        if (!key) {
          reject(new Error('Kakao JavaScript 키가 설정되지 않았습니다.'));
          return;
        }
        if (!window.Kakao?.isInitialized?.()) {
          window.Kakao.init(key);
        }
        resolve(window.Kakao);
      };

      if (existingScript) {
        if (existingScript.dataset.loaded === 'true') {
          handleReady();
        } else {
          existingScript.addEventListener('load', () => {
            existingScript.dataset.loaded = 'true';
            handleReady();
          });
          existingScript.addEventListener('error', () => {
            reject(new Error('Kakao SDK 로드에 실패했습니다.'));
          });
        }
        return;
      }

      const script = document.createElement('script');
      script.src = KAKAO_SDK_URL;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = 'true';
        handleReady();
      };
      script.onerror = () =>
        reject(new Error('Kakao SDK 스크립트 로드에 실패했습니다.'));

      document.head.appendChild(script);
    });
  }

  return kakaoInitializer;
}
