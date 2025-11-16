import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import SaveIcon from '../../assets/save.svg?react';
import Share2Icon from '../../assets/share2.svg?react';
import LinkIcon from '../../assets/link.svg?react';
import KakaoIcon from '../../assets/kakaoIcon.svg?react';
import InstaIcon from '../../assets/insta.svg?react';
import HeartIcon from '../../assets/heart.svg?react';
import FacebookIcon from '../../assets/facebook.svg?react';
import Modal from '../../components/common/Modal';
import { getImageBlob, downloadBlob } from '../../utils/image';
import { mapCulturalSpotName } from '../../utils/stampUtils';
import { getKakao } from '../../utils/kakao';
import { toS3WebsiteUrl } from '../../utils/s3';

export default function PhotoUploadCompletePage() {
  const location = useLocation();
  const navigate = useNavigate();
  // 카카오톡 공유를 위해 S3 URL 우선 사용
  const uploadedImage =
    location.state?.uploadResult?.imageUrl ||
    location.state?.imageUrl ||
    location.state?.selectedImage ||
    '/images/default.jpg';

  const [showNearbyPlaceModal, setShowNearbyPlaceModal] = useState(false);
  const [nearbyPlace, setNearbyPlace] = useState<string | null>(null);
  const [showShareChannels, setShowShareChannels] = useState(false);
  const [showRouletteModal, setShowRouletteModal] = useState(false);

  useEffect(() => {
    const rouletteGranted = location.state?.rouletteRewardGranted;

    // 룰렛 성공 팝업을 먼저 표시
    if (rouletteGranted) {
      setShowRouletteModal(true);
      return;
    }

    // 룰렛 팝업이 없으면 바로 nearbyPlace 체크
    const nearbyPlaceName = location.state?.nearbyPlace;

    if (nearbyPlaceName) {
      const { isSupported } = mapCulturalSpotName(nearbyPlaceName);
      if (isSupported) {
        setNearbyPlace(nearbyPlaceName);
        setShowNearbyPlaceModal(true);
        return;
      }
    }

    setNearbyPlace(null);
    setShowNearbyPlaceModal(false);
  }, [location.state]);

  // 디버그: 공유 대상 이미지 형식 점검 (data URL인지, https인지)
  useEffect(() => {
    try {
      const isDataUrl = uploadedImage?.startsWith('data:') ?? null;
      let protocol: string | null = null;
      try {
        protocol = new URL(uploadedImage).protocol;
      } catch {
        protocol = null;
      }
      // 라우터 state에서 우선순위 소스도 함께 출력
      const st = (window.history.state as any)?.usr ?? {};
      const stateImage =
        st?.uploadResult?.imageUrl ?? st?.imageUrl ?? st?.selectedImage ?? null;

      console.log('[UploadComplete] image debug:', {
        uploadedImage,
        isDataUrl,
        protocol,
        stateImage,
        stateIsDataUrl: stateImage?.startsWith?.('data:') ?? null,
        stateProtocol: (() => {
          try {
            return new URL(stateImage).protocol;
          } catch {
            return null;
          }
        })(),
      });
    } catch (e) {
      console.warn('[UploadComplete] image debug error:', e);
    }
  }, [uploadedImage]);

  const handleSave = async () => {
    try {
      const blob = await getImageBlob(uploadedImage);
      const now = new Date().toISOString().split('T')[0];
      let extension = 'png';

      switch (blob.type) {
        case 'image/jpeg':
        case 'image/jpg':
          extension = 'jpg';
          break;
        case 'image/webp':
          extension = 'webp';
          break;
        case 'image/png':
        default:
          extension = 'png';
          break;
      }

      const filename = `momentory-photo-${now}.${extension}`;
      downloadBlob(blob, filename);
      alert('사진이 저장되었습니다!');
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('사진 저장 중 오류가 발생했습니다.');
    }
  };

  const handleShareClick = () => {
    // 공유 채널 섹션만 표시 (Web Share API 호출하지 않음)
    setShowShareChannels(true);
  };

  const handleCopyLink = async () => {
    try {
      // 페이지에 표시되는 사진을 공유 (uploadedImage)
      // data: URL이면 공유할 수 없음
      if (uploadedImage.startsWith('data:')) {
        alert(
          '이미지 링크를 복사할 수 없습니다. 사진이 업로드된 후 다시 시도해주세요.'
        );
        return;
      }

      // 최신 Clipboard API 시도
      await navigator.clipboard.writeText(uploadedImage);
      alert('사진 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      // 구형 방식 (execCommand)으로 폴백
      if (uploadedImage.startsWith('data:')) {
        alert(
          '이미지 링크를 복사할 수 없습니다. 사진이 업로드된 후 다시 시도해주세요.'
        );
        return;
      }

      const textArea = document.createElement('textarea');
      textArea.value = uploadedImage;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('사진 링크가 클립보드에 복사되었습니다!');
      } catch {
        alert('링크 복사에 실패했습니다.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async (platform: string) => {
    // 페이지에 표시되는 사진을 공유 (uploadedImage)
    // data: URL이면 공유할 수 없음
    if (uploadedImage.startsWith('data:')) {
      alert(
        '이미지를 공유할 수 없습니다. 사진이 업로드된 후 다시 시도해주세요.'
      );
      return;
    }

    const shareUrl = uploadedImage;

    switch (platform) {
      case 'kakaotalk': {
        try {
          // data URL인 경우 S3 URL로 변환 필요
          if (uploadedImage.startsWith('data:')) {
            alert(
              '카카오톡 공유를 위해서는 웹에서 접근 가능한 이미지 URL이 필요합니다. 사진이 업로드된 후 다시 시도해주세요.'
            );
            return;
          }

          // S3 URL을 CloudFront URL로 변환 (카카오톡 공유를 위해)
          const shareImageUrl = toS3WebsiteUrl(uploadedImage);

          // 이미지 URL 검증
          console.log('카카오톡 공유 시도 - 원본 이미지 URL:', uploadedImage);
          console.log('카카오톡 공유 시도 - 변환된 이미지 URL:', shareImageUrl);
          try {
            const imageUrlObj = new URL(shareImageUrl);
            console.log('이미지 URL 도메인:', imageUrlObj.origin);
            console.log('이미지 URL 프로토콜:', imageUrlObj.protocol);
            console.log(
              '⚠️ 카카오 개발자 콘솔에 등록해야 할 도메인:',
              imageUrlObj.hostname
            );
          } catch (urlError) {
            console.warn(
              '이미지 URL 파싱 실패 (상대 경로일 수 있음):',
              urlError
            );
          }

          // 카카오 SDK 초기화 및 공유 API 호출
          const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
          console.log('환경 변수에서 로드한 카카오 키 존재 여부:', !!kakaoKey);
          console.log('카카오 키 길이:', kakaoKey?.length);

          if (!kakaoKey) {
            throw new Error(
              '카카오 JavaScript 키가 환경 변수에 설정되지 않았습니다. .env 파일을 확인해주세요.'
            );
          }

          const Kakao = await getKakao();

          console.log('카카오 SDK 초기화 완료:', Kakao?.isInitialized?.());
          console.log('카카오 SDK 객체 존재:', !!Kakao);
          console.log('카카오 Share 객체 존재:', !!Kakao?.Share);

          if (!Kakao?.isInitialized?.()) {
            throw new Error('카카오 SDK가 초기화되지 않았습니다.');
          }

          if (!Kakao?.Share) {
            throw new Error('카카오 Share API를 사용할 수 없습니다.');
          }

          // 이미지 URL 접근 가능 여부는 아래에서 Image 객체로 확인

          // 카카오톡 공유: 모든 환경에서 사용 (모바일, 데스크톱 모두 지원)
          try {
            console.log(
              '카카오톡 공유 API 호출 시작 - 이미지 URL:',
              shareImageUrl
            );
            console.log('카카오 SDK 객체:', Kakao);
            console.log('카카오 Share 객체:', Kakao.Share);
            console.log('카카오 SDK 초기화 상태:', Kakao?.isInitialized?.());

            // 이미지 URL이 실제로 접근 가능한지 확인
            console.log('이미지 URL 접근 테스트 시작:', shareImageUrl);
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise<void>((resolve) => {
              img.onload = () => {
                console.log(
                  '이미지 로드 성공 - 크기:',
                  img.width,
                  'x',
                  img.height
                );
                resolve();
              };
              img.onerror = () => {
                console.error(
                  '이미지 로드 실패 - URL이 유효하지 않을 수 있습니다:',
                  shareImageUrl
                );
                console.error(
                  '⚠️ 이 이미지 URL을 브라우저 주소창에 직접 입력해서 열 수 있는지 확인해주세요'
                );
                resolve(); // 에러가 있어도 계속 진행
              };
              img.src = shareImageUrl;

              // 타임아웃 설정 (5초)
              setTimeout(() => {
                if (!img.complete) {
                  console.warn('이미지 로드 타임아웃 (5초)');
                  resolve();
                }
              }, 5000);
            });

            console.log('카카오톡 공유 API 호출 시작...');
            console.log(
              '공유 파라미터:',
              JSON.stringify(
                {
                  objectType: 'feed',
                  content: {
                    title: 'Momentory',
                    description: '나의 순간을 Momentory에서 확인해보세요!',
                    imageUrl: shareImageUrl,
                    link: {
                      mobileWebUrl: window.location.origin,
                      webUrl: window.location.origin,
                    },
                  },
                },
                null,
                2
              )
            );

            // 팝업 차단 테스트
            const popupTest = window.open('', '_blank', 'width=1,height=1');
            if (popupTest) {
              popupTest.close();
              console.log('✅ 팝업 차단 없음 - 정상');
            } else {
              console.warn(
                '⚠️ 팝업이 차단되어 있습니다. 브라우저 설정에서 팝업을 허용해주세요.'
              );
              alert(
                '팝업이 차단되어 있습니다.\n브라우저 주소창 옆의 팝업 차단 아이콘을 클릭하여 이 사이트의 팝업을 허용해주세요.'
              );
            }

            console.log('카카오톡 공유 API 호출 시작...');

            // 데스크톱/모바일 구분
            const isMobile =
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              );
            console.log('디바이스 타입:', isMobile ? '모바일' : '데스크톱');
            console.log('User Agent:', navigator.userAgent);
            console.log(
              '화면 크기:',
              window.innerWidth,
              'x',
              window.innerHeight
            );

            if (isMobile) {
              // 모바일: sendDefault 사용 (카카오톡 앱 열기)
              Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                  title: 'Momentory',
                  description: '나의 순간을 Momentory에서 확인해보세요!',
                  imageUrl: shareImageUrl,
                  link: {
                    mobileWebUrl: window.location.origin,
                    webUrl: window.location.origin,
                  },
                },
                buttons: [
                  {
                    title: 'Momentory 보러가기',
                    link: {
                      mobileWebUrl: window.location.origin,
                      webUrl: window.location.origin,
                    },
                  },
                ],
              });
              console.log('카카오톡 공유 API 호출 완료 (모바일)');
            } else {
              // 데스크톱: 웹 공유 URL 직접 열기
              const shareUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_id=${import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY}&url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent('나의 순간을 Momentory에서 확인해보세요!')}`;
              console.log('데스크톱 웹 공유 URL:', shareUrl);

              const shareWindow = window.open(
                shareUrl,
                'kakao-share',
                'width=600,height=700,scrollbars=yes,resizable=yes'
              );

              if (!shareWindow) {
                alert(
                  '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.'
                );
              } else {
                console.log('카카오톡 웹 공유 창 열기 완료 (데스크톱)');
              }
            }

            // 공유 창 확인 안내
            setTimeout(() => {
              console.log('💡 공유 창 확인:');
              console.log('   - 모바일: 카카오톡 앱이 열려야 합니다');
              console.log(
                '   - 데스크톱: 카카오톡 공유 창이 새 창으로 열려야 합니다'
              );
              console.log(
                '   - 네트워크 탭(F12)에서 "send?appkey=..." 요청을 확인해주세요'
              );
            }, 500);
          } catch (shareError: any) {
            console.error('카카오톡 공유 API 호출 중 에러:', shareError);
            console.error('에러 상세 정보:', {
              message: shareError?.message,
              name: shareError?.name,
              stack: shareError?.stack,
              code: shareError?.code,
            });
            throw shareError;
          }
        } catch (error: any) {
          console.error('카카오톡 공유 실패:', error);
          console.error('에러 상세:', {
            message: error?.message,
            name: error?.name,
            stack: error?.stack,
          });

          // 에러 메시지에 따라 다른 처리
          const errorMessage = error?.message || '';

          if (errorMessage.includes('키') || errorMessage.includes('key')) {
            alert(
              '카카오톡 공유 설정이 필요합니다. 관리자에게 문의해주세요.\n(JavaScript 키 확인 필요)'
            );
          } else if (
            errorMessage.includes('도메인') ||
            errorMessage.includes('domain')
          ) {
            alert(
              '카카오톡 공유 설정이 필요합니다. 관리자에게 문의해주세요.\n(도메인 등록 확인 필요)'
            );
          } else {
            // 기타 에러 시 다운로드로 폴백
            try {
              const blob = await getImageBlob(uploadedImage);
              downloadBlob(blob, `momentory-photo-${Date.now()}.jpg`);
              alert(
                '카카오톡 공유에 실패했습니다. 이미지를 다운로드했습니다. 카카오톡에서 직접 공유해주세요.'
              );
            } catch (downloadError) {
              alert('카카오톡 공유에 실패했습니다. 다시 시도해주세요.');
            }
          }
        }
        break;
      }

      case 'facebook': {
        // 페이스북은 URL 공유만 가능하므로 이미지 URL을 직접 공유
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        break;
      }

      case 'instagram': {
        try {
          // 0) 공유 원본 확보 (CloudFront URL로 정규화 후 Blob 추출)
          const shareImageUrl = toS3WebsiteUrl(uploadedImage);
          const blob = await getImageBlob(shareImageUrl);

          // 1) 갤러리 저장(다운로드)
          const downloadName = `momentory-photo-${
            new Date().toISOString().split('T')[0]
          }.jpg`;
          downloadBlob(blob, downloadName);

          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );
          const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
          const isAndroid = /Android/i.test(navigator.userAgent);

          const tryOpen = async (url: string) => {
            return new Promise<void>((resolve) => {
              try {
                // location.href 사용 (대부분의 모바일 브라우저에서 동작)
                window.location.href = url;
              } catch {}
              // 짧은 지연 후 종료
              setTimeout(() => resolve(), 600);
            });
          };

          if (isMobile) {
            // 2) 스토리 딥링크 시도
            if (isIOS) {
              await tryOpen('instagram://story-camera');
            } else if (isAndroid) {
              // Android에서도 story-camera 스킴 시도
              await tryOpen('instagram://story-camera');
            }

            // 3) 실패시 인스타 앱 열기
            await tryOpen('instagram://app');

            // 4) 그래도 실패 → Web Share API 시도
            if (navigator.share) {
              try {
                const file = new File([blob], downloadName, {
                  type: blob.type || 'image/jpeg',
                });
                const canShareFiles =
                  navigator.canShare && navigator.canShare({ files: [file] });
                if (canShareFiles) {
                  await navigator.share({
                    title: 'Momentory',
                    text: '나의 순간을 Momentory에서 확인해보세요!',
                    files: [file],
                  });
                  return;
                }
              } catch (shareError) {
                if (
                  shareError instanceof Error &&
                  shareError.name === 'AbortError'
                ) {
                  return;
                }
              }
            }

            // 5) 최종 폴백 안내
            alert(
              '사진을 갤러리에 저장했어요.\n인스타그램 앱을 열어 스토리에서 저장한 사진을 선택해 공유해주세요.'
            );
          } else {
            // 데스크톱: 저장 안내
            alert(
              '사진을 다운로드했어요.\n인스타그램 웹사이트(instagram.com)에서 다운로드한 사진을 업로드해주세요.'
            );
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('인스타그램 공유 실패:', error);
            alert('인스타그램 공유에 실패했습니다. 다시 시도해주세요.');
          }
        }
        break;
      }

      case 'tistory': {
        // 티스토리는 URL 공유 외 별도 API가 없으므로 메인 페이지로 이동
        window.open('https://www.tistory.com/', '_blank');
        break;
      }
    }
  };

  const handleNearbyPlaceYes = () => {
    setShowNearbyPlaceModal(false);
    navigate('/question', {
      state: {
        ...location.state,
        question: `${nearbyPlace}를 방문하셨나요?`,
        questionImage: uploadedImage,
        selectedImage: uploadedImage,
        imageUrl: uploadedImage,
      },
    });
  };

  const handleNearbyPlaceNo = () => {
    setShowNearbyPlaceModal(false);
  };

  const handleCloseModal = () => {
    setShowNearbyPlaceModal(false);
  };

  const handleRouletteClose = () => {
    setShowRouletteModal(false);

    // 룰렛 모달을 닫은 후 nearbyPlace 체크
    const nearbyPlaceName = location.state?.nearbyPlace;

    if (nearbyPlaceName) {
      const { isSupported } = mapCulturalSpotName(nearbyPlaceName);
      if (isSupported) {
        setNearbyPlace(nearbyPlaceName);
        setShowNearbyPlaceModal(true);
      }
    }
  };

  const nearbySpots =
    (location.state?.nearbySpots as
      | Array<{
          name: string;
          imageUrl?: string | null;
        }>
      | undefined) ?? [];

  const recommendedPlaces = nearbySpots.slice(0, 3).map((spot, index) => ({
    id: `${spot.name}-${index}`,
    name: spot.name,
    image: spot.imageUrl?.trim() || null,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {showRouletteModal && (
        <Modal title="룰렛 성공!" onClose={handleRouletteClose}>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#FF7070] rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <p className="text-center text-[#4C4C4C] mb-4 text-lg font-bold">
              축하합니다!
            </p>
            <p className="text-center text-[#4C4C4C] mb-8 text-base">
              방문 스탬프 + 룰렛 성공으로
              <br />
              <span className="text-[#FF7070] font-bold text-xl">
                +{location.state?.points || 0} 포인트
              </span>
              를 획득했습니다!
            </p>

            <button
              onClick={handleRouletteClose}
              className="w-full py-4 px-6 rounded-[12px] bg-[#FF7070] text-white font-semibold text-base hover:bg-[#ff6060] transition-colors"
            >
              확인
            </button>
          </div>
        </Modal>
      )}

      {showNearbyPlaceModal && nearbyPlace && (
        <Modal title="근처 문화 관광지 발견!" onClose={handleCloseModal}>
          <p className="text-center text-[#4C4C4C] mb-8 text-lg font-bold">
            혹시{' '}
            <span className="text-[#B66262] font-semibold">
              [{nearbyPlace}]
            </span>
            에도 방문하셨나요?
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleNearbyPlaceYes}
              className="flex-1 py-4 px-6 rounded-[12px] bg-[#FF7070] text-white font-semibold text-base hover:bg-[#ff6060] transition-colors whitespace-nowrap"
            >
              예, 방문했어요
            </button>
            <button
              onClick={handleNearbyPlaceNo}
              className="flex-1 py-4 px-6 rounded-[12px] bg-[#EAEAEA] text-[#8D8D8D] font-semibold text-base hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              아니요
            </button>
          </div>
        </Modal>
      )}

      <div className="w-full max-w-[480px] mx-auto px-10 pt-10">
        <div className="mb-10">
          <h1 className="text-[29px] font-extrabold text-left text-[#444444]">
            사진 업로드가
            <br />
            완료되었어요!
          </h1>
        </div>

        <div className="mb-20 flex justify-center">
          <div className="relative w-[280px] bg-white border-2 border-[#B3B3B3] shadow-xl">
            <div className="px-5 pt-5 pb-[60px]">
              <div
                className="w-full bg-gray-100 flex items-center justify-center"
                style={{ aspectRatio: '340 / 290', minHeight: '200px' }}
              >
                <img
                  src={uploadedImage}
                  alt="업로드된 사진"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default.jpg';
                  }}
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 flex gap-2 translate-x-1/4 translate-y-1/2 z-10">
              <button
                onClick={handleSave}
                className="w-12 h-12 rounded-full bg-[#FF7070] flex items-center justify-center shadow-lg hover:bg-[#ff6060] transition-colors"
              >
                <SaveIcon className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={handleShareClick}
                className="w-12 h-12 rounded-full bg-white border border-[#D4D4D4] flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Share2Icon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showShareChannels && (
        <div className="w-full max-w-[480px] mx-auto bg-[#F8F1F1] rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-center text-[#B28B8B] font-bold mb-6">
            공유할 채널을 선택하세요
          </p>
          <div className="flex justify-center gap-8 sm:gap-10 md:gap-12 flex-wrap">
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-1"
            >
              <LinkIcon className="w-10 h-10 text-gray-600" />
              <span className="text-xs text-[#B28B8B]">링크 복사</span>
            </button>

            <button
              onClick={() => handleShare('kakaotalk')}
              className="flex flex-col items-center gap-1"
            >
              <KakaoIcon className="w-10 h-10" />
              <span className="text-xs text-[#B28B8B]">카카오톡</span>
            </button>

            <button
              onClick={() => handleShare('instagram')}
              className="flex flex-col items-center gap-1"
            >
              <InstaIcon className="w-10 h-10" />
              <span className="text-xs text-[#B28B8B]">인스타그램</span>
            </button>

            <button
              onClick={() => handleShare('tistory')}
              className="flex flex-col items-center gap-1"
            >
              <HeartIcon className="w-10 h-10" />
              <span className="text-xs text-[#B28B8B]">티스토리</span>
            </button>

            <button
              onClick={() => handleShare('facebook')}
              className="flex flex-col items-center gap-1"
            >
              <FacebookIcon className="w-10 h-10" />
              <span className="text-xs text-[#B28B8B]">페이스북</span>
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[480px] mx-auto mb-20 pb-8">
        <div
          className="bg-[#FF7070] p-5 mb-4 cursor-pointer hover:bg-[#ff6060] transition-colors flex items-center justify-between"
          onClick={() => {
            const photoId = location.state?.photoId as number | undefined;
            const nearbySpots = location.state?.nearbySpots;
            navigate('/recommended-places', {
              state: {
                ...location.state,
                photoId,
                nearbySpots,
              },
            });
          }}
        >
          <h2 className="text-white font-bold text-lg text-left px-5">
            추가로 이런 관광지는 어떠세요?
          </h2>
          <ChevronRight className="w-6 h-6 text-white flex-shrink-0" />
        </div>
        {recommendedPlaces.length ? (
          <div className="flex flex-wrap justify-center gap-5">
            {recommendedPlaces.map((place) => (
              <div key={place.id} className="bg-white overflow-hidden w-[90px]">
                <div className="aspect-square bg-gray-200 border border-[#812D2D] rounded-lg overflow-hidden">
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        if (
                          event.currentTarget.dataset.fallbackApplied === 'true'
                        ) {
                          return;
                        }
                        event.currentTarget.dataset.fallbackApplied = 'true';
                        event.currentTarget.src = '/images/default.jpg';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#F3F3F3] text-[#A47272]">
                      <MapPin className="h-5 w-5" strokeWidth={1.5} />
                      <span className="text-[11px] font-semibold">
                        이미지 준비중
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-center py-2 font-semibold text-[#873737]">
                  {place.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[#A3A3A3]">
            추천 관광지 정보를 불러오지 못했습니다.
          </p>
        )}
      </div>
    </div>
  );
}
