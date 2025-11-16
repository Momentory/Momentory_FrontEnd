import { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUploadTask } from '../../hooks/photo/useUploadTask';
import type { UploadState, UploadSuccess } from '../../types/upload';

export default function PhotoUploadProgressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as UploadState | undefined;
  const uploadContext = state?.uploadContext;

  const hasValidState = useMemo(() => {
    return (
      Boolean(uploadContext) &&
      Boolean(state?.selectedImage || state?.uploadResult)
    );
  }, [uploadContext, state?.selectedImage, state?.uploadResult]);

  useEffect(() => {
    if (!hasValidState) {
      navigate('/upload', { replace: true });
    }
  }, [hasValidState, navigate]);

  const handleSuccess = useCallback(
    ({ uploadResult, nearbySpots }: UploadSuccess) => {
      navigate('/photo-upload-success', {
        replace: true,
        state: {
          ...state,
          uploadResult,
          imageUrl: uploadResult.imageUrl,
          selectedImage: uploadResult.imageUrl,
          photoId: uploadResult.photoId,
          regionName: uploadResult.regionalStampName,
          // 지역 스탬프만 바로 획득 (문화 스탬프는 인증 후 발급)
          stampType: uploadResult.regionalStampGranted ? 'regional' : undefined,
          points: uploadResult.rouletteRewardGranted
            ? uploadResult.rouletteRewardPoint
            : undefined,
          rouletteRewardGranted: uploadResult.rouletteRewardGranted,
          // 근처 문화 관광지 정보 (인증 프로세스용)
          nearbyPlace: uploadResult.hasNearbyCulturalSpots
            ? uploadResult.nearbyCulturalSpotName
            : undefined,
          nearbySpots,
        },
      });
    },
    [navigate, state]
  );

  const { progress, error, isUploading, retry } = useUploadTask({
    state,
    uploadContext,
    hasValidState,
    onSuccess: handleSuccess,
  });

  if (!hasValidState) {
    return null;
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
      <div className="relative">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#FF7070"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300 ease-out"
          />
        </svg>
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-red-500">ERROR</span>
          </div>
        )}
      </div>
      <div className="mt-6">
        <p className="text-3xl font-semibold text-gray-800 mb-2">{progress}%</p>
        <p className="text-lg text-gray-600">
          {error
            ? error
            : isUploading
              ? '사진 업로드 중입니다...'
              : '업로드를 준비하고 있습니다...'}
        </p>
      </div>
      {error && (
        <button
          type="button"
          className="mt-8 px-6 py-3 rounded-full bg-[#FF7070] text-white font-semibold hover:bg-[#ff6060] transition-colors"
          onClick={retry}
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
