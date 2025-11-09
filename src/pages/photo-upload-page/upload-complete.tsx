import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SaveIcon from '../../assets/save.svg?react';
import Share2Icon from '../../assets/share2.svg?react';
import LinkIcon from '../../assets/link.svg?react';
import KakaoIcon from '../../assets/kakaoIcon.svg?react';
import InstaIcon from '../../assets/insta.svg?react';
import HeartIcon from '../../assets/heart.svg?react';
import FacebookIcon from '../../assets/facebook.svg?react';
import Modal from '../../components/common/Modal';
import { getImageBlob, downloadBlob } from '../../utils/image';

export default function PhotoUploadCompletePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const uploadedImage =
    location.state?.selectedImage ||
    location.state?.imageUrl ||
    '/images/default.jpg';

  const [showNearbyPlaceModal, setShowNearbyPlaceModal] = useState(false);
  const [nearbyPlace, setNearbyPlace] = useState<string | null>(null);

  useEffect(() => {
    const nearbyPlaceName = location.state?.nearbyPlace || '경복궁';

    if (nearbyPlaceName) {
      setNearbyPlace(nearbyPlaceName);
      setShowNearbyPlaceModal(true);
    }
  }, [location.state]);

  const handleSave = async () => {
    try {
      const blob = await getImageBlob(uploadedImage);
      const filename = `momentory-photo-${new Date().toISOString().split('T')[0]}.png`;
      downloadBlob(blob, filename);
      alert('사진이 저장되었습니다!');
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('사진 저장 중 오류가 발생했습니다.');
    }
  };

  const handleShareClick = async () => {
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
      // 최신 Clipboard API 시도
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      // 구형 방식 (execCommand)으로 폴백
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('링크가 클립보드에 복사되었습니다!');
      } catch {
        alert('링크 복사에 실패했습니다.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;

    switch (platform) {
      case 'kakaotalk': {
        try {
          // 카카오톡은 이미지 직접 공유 API를 제공하지 않아,
          // 기기에 다운로드 후 앱 실행을 유도하여 사용자가 직접 공유하도록 함
          const blob = await getImageBlob(uploadedImage);
          const filename = `momentory-photo-${new Date().toISOString().split('T')[0]}.jpg`;
          downloadBlob(blob, filename);

          // 모바일 환경 확인
          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );

          if (isMobile) {
            // 모바일: 카카오톡 앱 열기 시도
            setTimeout(() => {
              window.location.href = 'kakaotalk://';
              alert(
                '사진이 다운로드되었습니다. 카카오톡 앱에서 다운로드한 사진을 공유해주세요.'
              );
            }, 500);
          } else {
            alert(
              '사진이 다운로드되었습니다. 카카오톡 앱에서 다운로드한 사진을 공유해주세요.'
            );
          }
        } catch (error) {
          console.error('카카오톡 공유 실패:', error);
          alert('카카오톡 공유에 실패했습니다. 다시 시도해주세요.');
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

  const recommendedPlaces = [
    {
      id: 1,
      name: '역곡계곡',
      image: '/images/yeokgok-valley.jpg',
    },
    {
      id: 2,
      name: '가톨릭미술관',
      image: '/images/catholic-museum.jpg',
    },
    {
      id: 3,
      name: '부천공원',
      image: '/images/bucheon-park.jpg',
    },
  ];

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

      <div className="w-full max-w-[480px] mx-auto px-10 pt-15">
        <div className="mb-10">
          <h1 className="text-[29px] font-bold text-left text-[#444444]">
            사진 업로드가
            <br />
            완료되었어요!
          </h1>
        </div>

        <div className="mb-20 flex justify-center">
          <div className="relative w-70 h-70 bg-white border-2 border-[#B3B3B3] overflow-visible shadow-xl p-5">
            <img
              src={uploadedImage}
              alt="업로드된 사진"
              className="w-full aspect-194/166 object-cover"
            />
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

      <div className="w-full max-w-[480px] mx-auto bg-[#F8F1F1] rounded-xl p-4">
        <p className="text-center text-[#B28B8B] mb-6">
          공유할 채널을 선택하세요
        </p>
        <div className="flex justify-center gap-10">
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

      <div className="w-full max-w-[480px] mx-auto mb-8">
        <div className="bg-[#FF7070] p-5 mb-4">
          <h2 className="text-white font-bold text-lg text-left px-5">
            추가로 이런 관광지는 어떠세요?
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {recommendedPlaces.map((place) => (
            <div key={place.id} className="bg-white overflow-hidden w-[90px]">
              <div className="aspect-square bg-gray-200 border border-[#812D2D] rounded-lg overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-center py-2 font-semibold text-[#873737]">
                {place.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
