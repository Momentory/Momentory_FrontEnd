import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { uploadFile } from '../../api/S3';
import type { UploadPhotoRequest } from '../../types/photo';
import { dataUrlToFile } from '../../utils/image';
import {
  useUploadPhotoMutation,
  useUpdatePhotoNearbyMutation,
} from '../../hooks/photo/usePhotoMutations';

type UploadContext = {
  description: string;
  isPrivate: boolean;
  markerColor: string;
  markerLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  cityName: string;
};

interface UploadProgressState {
  selectedImage?: string;
  uploadContext?: UploadContext;
  uploadResult?: {
    imageName: string;
    imageUrl: string;
  };
  brightness?: number;
  contrast?: number;
  saturation?: number;
  filterIntensity?: number;
  selectedFilter?: string;
  rotation?: number;
  position?: { x: number; y: number };
  markerColor?: string;
  markerLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
}

export default function PhotoUploadProgressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as UploadProgressState | undefined;
  const uploadContext = state?.uploadContext;

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhotoMutation = useUploadPhotoMutation();
  const nearbyMutation = useUpdatePhotoNearbyMutation();

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

  useEffect(() => {
    if (!hasValidState || !uploadContext) {
      return;
    }

    let isCancelled = false;

    const performUpload = async () => {
      setIsUploading(true);
      setError(null);
      setProgress(5);

      try {
        let effectiveUploadResult = state?.uploadResult ?? null;
        const shouldReupload =
          Boolean(state?.selectedImage?.startsWith('data:')) ||
          !effectiveUploadResult;

        if (shouldReupload) {
          const file = await resolveFileForUpload(state);
          if (isCancelled) return;

          setProgress(25);
          const uploadResponse = await uploadFile(file);
          if (isCancelled) return;

          effectiveUploadResult = uploadResponse.result;
        } else {
          setProgress(25);
        }

        setProgress(60);
        const payload: UploadPhotoRequest = {
          imageName: effectiveUploadResult!.imageName,
          imageUrl: effectiveUploadResult!.imageUrl,
          latitude: uploadContext.markerLocation.lat,
          longitude: uploadContext.markerLocation.lng,
          cityName: uploadContext.cityName,
          color: uploadContext.markerColor,
          visibility: !uploadContext.isPrivate,
          memo: uploadContext.description,
        };

        const photoResponse = await uploadPhotoMutation.mutateAsync(payload);
        if (isCancelled) return;

        const photoId = photoResponse.result.photoId;
        let nearbyResult:
          | Awaited<ReturnType<typeof nearbyMutation.mutateAsync>>
          | undefined;
        if (photoId) {
          try {
            nearbyResult = await nearbyMutation.mutateAsync({ photoId });
          } catch (nearbyError) {
            console.warn('근처 관광지 추천 실패:', nearbyError);
          }
        }

        setProgress(100);

        const uploadResult = photoResponse.result;
        navigate('/photo-upload-success', {
          replace: true,
          state: {
            ...state,
            uploadResult,
            imageUrl: uploadResult.imageUrl,
            selectedImage: uploadResult.imageUrl,
            photoId: uploadResult.photoId,
            regionName: uploadResult.regionalStampName,
            stampType: uploadResult.regionalStampGranted
              ? 'regional'
              : undefined,
            points: uploadResult.rouletteRewardGranted
              ? uploadResult.rouletteRewardPoint
              : undefined,
            rouletteRewardGranted: uploadResult.rouletteRewardGranted,
            nearbyPlace: uploadResult.hasNearbyCulturalSpots
              ? uploadResult.nearbyCulturalSpotName
              : undefined,
            nearbySpots: nearbyResult?.result?.spots,
          },
        });
      } catch (err) {
        console.error('사진 업로드 실패:', err);
        if (!isCancelled) {
          const message =
            err instanceof Error && err.message
              ? err.message
              : '사진 업로드에 실패했습니다. 다시 시도해주세요.';
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsUploading(false);
        }
      }
    };

    performUpload();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, hasValidState]);

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
          onClick={() => setAttempt((prev) => prev + 1)}
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

async function resolveFileForUpload(
  state: UploadProgressState | undefined
): Promise<File> {
  if (!state) {
    throw new Error('업로드 정보가 존재하지 않습니다.');
  }

  if (state.selectedImage && state.selectedImage.startsWith('data:')) {
    const extensionMatch = state.selectedImage.match(/^data:image\/(.*?);/);
    const extension = extensionMatch ? extensionMatch[1] : 'jpeg';
    return dataUrlToFile(
      state.selectedImage,
      `momentory-photo-${Date.now()}.${extension}`
    );
  }

  if (state.selectedImage) {
    const response = await fetch(state.selectedImage);
    if (!response.ok) {
      throw new Error('이미지를 불러오지 못했습니다.');
    }
    const blob = await response.blob();
    return new File([blob], `momentory-photo-${Date.now()}.jpg`, {
      type: blob.type || 'image/jpeg',
    });
  }

  throw new Error('업로드할 파일을 찾을 수 없습니다.');
}
