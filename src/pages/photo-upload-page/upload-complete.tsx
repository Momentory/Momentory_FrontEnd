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
    if (rouletteGranted) {
      setShowRouletteModal(true);
      return;
    }
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

  useEffect(() => {
    try {
      const isDataUrl = uploadedImage?.startsWith('data:') ?? null;
      let protocol: string | null = null;
      try {
        protocol = new URL(uploadedImage).protocol;
      } catch (e) {
        protocol = null;
        console.warn(e);
      }
      const st = (window.history.state as any)?.usr ?? {};
      const stateImage =
        st?.uploadResult?.imageUrl ?? st?.imageUrl ?? st?.selectedImage ?? null;
      console.log('[UploadComplete] image debug:', {
        uploadedImage,
        isDataUrl,
        protocol,
        stateImage,
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
    setShowShareChannels(true);
  };

  const handleCopyLink = async () => {
    try {
      if (uploadedImage.startsWith('data:')) {
        alert(
          '이미지 링크를 복사할 수 없습니다. 사진이 업로드된 후 다시 시도해주세요.'
        );
        return;
      }
      await navigator.clipboard.writeText(uploadedImage);
      alert('사진 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('링크 복사 실패:', error);
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
      } catch (cmdError) {
        console.error(cmdError);
        alert('링크 복사에 실패했습니다.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async (platform: string) => {
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
          if (uploadedImage.startsWith('data:')) {
            alert(
              '카카오톡 공유를 위해서는 웹에서 접근 가능한 이미지 URL이 필요합니다.'
            );
            return;
          }
          const shareImageUrl = toS3WebsiteUrl(uploadedImage);
          const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
          if (!kakaoKey)
            throw new Error('카카오 JavaScript 키가 설정되지 않았습니다.');
          const Kakao = await getKakao();
          if (!Kakao?.isInitialized?.())
            throw new Error('카카오 SDK가 초기화되지 않았습니다.');
          if (!Kakao?.Share)
            throw new Error('카카오 Share API를 사용할 수 없습니다.');

          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = shareImageUrl;
            setTimeout(() => {
              if (!img.complete) resolve();
            }, 5000);
          });

          const popupTest = window.open('', '_blank', 'width=1,height=1');
          if (popupTest) popupTest.close();
          else alert('팝업이 차단되어 있습니다. 팝업을 허용해주세요.');

          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );
          if (isMobile) {
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
          } else {
            const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_id=${import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY}&url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent('나의 순간을 Momentory에서 확인해보세요!')}`;
            const shareWindow = window.open(
              kakaoShareUrl,
              'kakao-share',
              'width=600,height=700,scrollbars=yes,resizable=yes'
            );
            if (!shareWindow)
              alert(
                '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.'
              );
          }
        } catch (error: any) {
          console.error('카카오톡 공유 실패:', error);
          try {
            const blob = await getImageBlob(uploadedImage);
            downloadBlob(blob, `momentory-photo-${Date.now()}.jpg`);
            alert('카카오톡 공유에 실패했습니다. 이미지를 다운로드했습니다.');
          } catch (dlError) {
            console.error(dlError);
            alert('카카오톡 공유에 실패했습니다. 다시 시도해주세요.');
          }
        }
        break;
      }
      case 'facebook': {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        break;
      }
      case 'instagram': {
        try {
          const shareImageUrl = toS3WebsiteUrl(uploadedImage);
          const blob = await getImageBlob(shareImageUrl);
          const downloadName = `momentory-photo-${new Date().toISOString().split('T')[0]}.jpg`;
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
                window.location.href = url;
              } catch (e) {
                console.error(e);
              }
              setTimeout(() => resolve(), 600);
            });
          };
          if (isMobile) {
            if (isIOS || isAndroid) await tryOpen('instagram://story-camera');
            await tryOpen('instagram://app');
            if (navigator.share) {
              try {
                const file = new File([blob], downloadName, {
                  type: blob.type || 'image/jpeg',
                });
                if (
                  navigator.canShare &&
                  navigator.canShare({ files: [file] })
                ) {
                  await navigator.share({
                    title: 'Momentory',
                    text: '나의 순간을 Momentory에서 확인해보세요!',
                    files: [file],
                  });
                  return;
                }
              } catch (shareError) {
                console.error(shareError);
              }
            }
            alert(
              '사진을 갤러리에 저장했어요.\n인스타그램 앱을 열어 스토리에서 저장한 사진을 선택해 공유해주세요.'
            );
          } else {
            alert(
              '사진을 다운로드했어요.\n인스타그램 웹사이트에서 다운로드한 사진을 업로드해주세요.'
            );
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError')
            alert('인스타그램 공유에 실패했습니다.');
        }
        break;
      }
      case 'tistory': {
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
      | Array<{ name: string; imageUrl?: string | null }>
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
            navigate('/recommended-places', {
              state: {
                ...location.state,
                photoId: location.state?.photoId,
                nearbySpots: location.state?.nearbySpots,
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
                        )
                          return;
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
