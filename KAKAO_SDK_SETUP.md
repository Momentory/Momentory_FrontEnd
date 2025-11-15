# 카카오 JavaScript SDK 설정 가이드

## 1. 카카오 개발자 앱 등록

1. [카카오 개발자 사이트](https://developers.kakao.com/)에 접속하여 로그인
2. "내 애플리케이션" → "애플리케이션 추가하기" 클릭
3. 앱 이름, 사업자명 등록 후 저장

## 2. JavaScript 키 발급

1. 등록한 앱 선택
2. "앱 설정" → "앱 키" 메뉴에서 JavaScript 키 확인
3. JavaScript 키를 복사하여 `.env` 파일에 추가

## 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
VITE_KAKAO_JAVASCRIPT_KEY=your_javascript_key_here
```

⚠️ **주의**: `.env` 파일은 `.gitignore`에 포함되어 있어야 합니다.

## 4. 플랫폼 설정

### 4.1 Web 플랫폼 등록

1. 카카오 개발자 콘솔에서 앱 선택
2. "앱 설정" → "플랫폼" 메뉴로 이동
3. "Web 플랫폼 등록" 클릭
4. 사이트 도메인 등록:
   - 개발 환경: `http://localhost:5173` (또는 사용 중인 포트)
   - 운영 환경: 실제 도메인 (예: `https://momentory.com`)

### 4.2 카카오톡 공유 활성화

1. "제품 설정" → "카카오톡 채널" 메뉴로 이동
2. "카카오톡 채널 추가" (선택사항)
3. "제품 설정" → "카카오 로그인" 메뉴에서 "활성화 설정" → "카카오톡 메시지 전송" 활성화

## 5. 이미지 URL 설정

카카오톡 공유 시 사용하는 이미지 URL은 다음 조건을 만족해야 합니다:

- ✅ 공개적으로 접근 가능한 URL (S3, CDN 등)
- ✅ HTTPS 프로토콜 (운영 환경)
- ✅ 이미지 파일 형식 (JPG, PNG 등)
- ✅ 최소 크기: 200x200px
- ✅ 최대 크기: 5MB

❌ **data URL은 사용할 수 없습니다** (예: `data:image/jpeg;base64,...`)

## 6. 테스트

### 6.1 개발 환경에서 테스트

1. `.env` 파일에 JavaScript 키 설정
2. 개발 서버 실행: `npm run dev`
3. 카카오톡 공유 버튼 클릭
4. 카카오톡 앱이 열리고 공유 다이얼로그가 표시되는지 확인

### 6.2 문제 해결

#### "카카오톡이 실행되지 않나요?" 메시지가 나타나는 경우

1. **플랫폼 설정 확인**
   - 카카오 개발자 콘솔에서 Web 플랫폼이 등록되어 있는지 확인
   - 현재 도메인이 등록된 도메인과 일치하는지 확인

2. **JavaScript 키 확인**
   - `.env` 파일에 올바른 JavaScript 키가 설정되어 있는지 확인
   - 환경 변수가 제대로 로드되는지 확인 (브라우저 콘솔에서 `import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY` 확인)

3. **이미지 URL 확인**
   - 이미지 URL이 공개적으로 접근 가능한지 확인
   - CORS 설정이 올바른지 확인

4. **카카오톡 앱 설치 확인**
   - 모바일에서 테스트하는 경우 카카오톡 앱이 설치되어 있는지 확인
   - 카카오톡 앱이 최신 버전인지 확인

## 7. 코드 사용 방법

### 7.1 기본 사용법

```typescript
import { getKakao } from '../../utils/kakao';

const handleKakaoShare = async () => {
  try {
    const Kakao = await getKakao();

    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: 'Momentory',
        description: '나의 순간을 Momentory에서 확인해보세요!',
        imageUrl: 'https://example.com/image.jpg',
        link: {
          mobileWebUrl: 'https://momentory.com',
          webUrl: 'https://momentory.com',
        },
      },
      buttons: [
        {
          title: 'Momentory 보러가기',
          link: {
            mobileWebUrl: 'https://momentory.com',
            webUrl: 'https://momentory.com',
          },
        },
      ],
    });
  } catch (error) {
    console.error('카카오톡 공유 실패:', error);
  }
};
```

### 7.2 현재 구현 위치

- **카카오 SDK 유틸리티**: `src/utils/kakao.ts`
- **카카오톡 공유 사용**: `src/pages/photo-upload-page/upload-complete.tsx`

## 8. 참고 자료

- [카카오 개발자 문서](https://developers.kakao.com/docs)
- [카카오톡 메시지 전송 가이드](https://developers.kakao.com/docs/latest/ko/message/js-link)
- [카카오 JavaScript SDK 가이드](https://developers.kakao.com/docs/latest/ko/javascript/getting-started)



