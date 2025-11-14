import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
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

export default function PhotoUploadCompletePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const uploadedImage =
    location.state?.selectedImage ||
    location.state?.imageUrl ||
    '/images/default.jpg';

  const [showNearbyPlaceModal, setShowNearbyPlaceModal] = useState(false);
  const [nearbyPlace, setNearbyPlace] = useState<string | null>(null);
  const [showShareChannels, setShowShareChannels] = useState(false);

  useEffect(() => {
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

  const handleShareClick = async () => {
    // 공유 채널 섹션 표시
    setShowShareChannels(true);

    // Web Share API는 모바일 환경에서만 지원되는 경우가 많음
    if (
      navigator.share &&
      /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
    ) {
      try {
        const blob = await getImageBlob(uploadedImage);
        const file = new File([blob], 'momentory-photo.png', {
          type: 'image/png',
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          // 네이티브 공유 UI 호출
          await navigator.share({
            title: 'Momentory 사진 공유',
            text: '나의 순간을 공유합니다!',
            files: [file],
          });
          return;
        }
      } catch (error) {
        // 사용자가 공유를 취소한 경우(AbortError)는 에러로 간주하지 않음
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('공유 실패:', error);
        }
      }
    }
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

          // 카카오 SDK 초기화 및 공유 API 호출
          const Kakao = await getKakao();

          // 카카오톡 공유: 모든 환경에서 사용 (모바일, 데스크톱 모두 지원)
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: 'Momentory',
              description: '나의 순간을 Momentory에서 확인해보세요!',
              imageUrl: uploadedImage,
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
        } catch (error: any) {
          console.error('카카오톡 공유 실패:', error);

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
          // 모바일에서는 Web Share API (스토리 등)를 우선 시도하고,
          // 실패하거나 PC 환경일 경우 다운로드로 폴백
          const blob = await getImageBlob(uploadedImage);

          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );

          // Web Share API 지원 여부 확인 (모바일, HTTPS 환경)
          if (isMobile && navigator.share) {
            const file = new File(
              [blob],
              `momentory-photo-${new Date().toISOString().split('T')[0]}.jpg`,
              {
                type: 'image/jpeg',
              }
            );

            const canShareFiles =
              navigator.canShare && navigator.canShare({ files: [file] });

            if (canShareFiles) {
              // Web Share API (네이티브 공유) 시도
              try {
                await navigator.share({
                  title: 'Momentory',
                  text: '나의 순간을 Momentory에서 확인해보세요!',
                  files: [file],
                });
                // 공유 성공 시 여기서 종료
                return;
              } catch (shareError) {
                // 사용자가 공유를 취소한(AbortError) 경우 무시
                if (
                  shareError instanceof Error &&
                  shareError.name === 'AbortError'
                ) {
                  return;
                }
                // 다른 에러 발생 시, 폴백 로직으로 넘어가도록 함
              }
            }
          }

          // Web Share API를 지원하지 않거나 실패한 경우 (폴백 로직)
          const filename = `momentory-photo-${new Date().toISOString().split('T')[0]}.jpg`;
          downloadBlob(blob, filename);

          if (isMobile) {
            alert(
              '사진이 다운로드되었습니다. 인스타그램 앱에서 다운로드한 사진을 선택하여 업로드해주세요.'
            );
          } else {
            alert(
              '사진이 다운로드되었습니다. 인스타그램 웹사이트에서 다운로드한 사진을 업로드해주세요.'
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
                className="w-full bg-gray-100"
                style={{ aspectRatio: '340 / 290' }}
              >
                <img
                  src={uploadedImage}
                  alt="업로드된 사진"
                  className="w-full h-full object-cover"
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
        <div className="bg-[#FF7070] p-5 mb-4">
          <h2 className="text-white font-bold text-lg text-left px-5">
            추가로 이런 관광지는 어떠세요?
          </h2>
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
