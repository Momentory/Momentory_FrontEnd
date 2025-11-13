// 사진 업로드 → 저장 → 근처 관광지 조회까지 전체 업로드 흐름 담당
import { useEffect, useState } from 'react';
import { uploadFile } from '../../api/S3';
import { dataUrlToFile } from '../../utils/image';
import { useUploadPhotoMutation, usePhotoNearby } from './usePhotoMutations';
import type {
  UploadPhotoRequest,
  NearbySpotsResponse,
} from '../../types/photo';
import type { UploadCtx, UploadState, UploadSuccess } from '../../types/upload';
interface UseUploadTaskOptions {
  state: UploadState | undefined;
  uploadContext?: UploadCtx;
  hasValidState: boolean;
  onSuccess: (payload: UploadSuccess) => void;
}

export function useUploadTask({
  state,
  uploadContext,
  hasValidState,
  onSuccess,
}: UseUploadTaskOptions) {
  const uploadPhotoMutation = useUploadPhotoMutation();
  const nearbyMutation = usePhotoNearby();
  const uploadPhotoMutate = uploadPhotoMutation.mutateAsync;
  const nearbyMutate = nearbyMutation.mutateAsync;

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!hasValidState || !uploadContext) {
      return;
    }

    let isCancelled = false;

    const run = async () => {
      setIsUploading(true);
      setError(null);
      setProgress(5);

      try {
        let effectiveUploadResult = state?.uploadResult ?? null;
        const shouldReupload =
          Boolean(state?.selectedImage?.startsWith('data:')) ||
          !effectiveUploadResult;

        if (shouldReupload) {
          const file = await toFile(state);
          if (isCancelled) return;

          setProgress(25);
          const uploadResponse = await uploadFile(file);
          if (isCancelled) return;

          effectiveUploadResult = uploadResponse.result;
        } else {
          setProgress(25);
        }

        if (!effectiveUploadResult) {
          throw new Error('업로드 결과가 존재하지 않습니다.');
        }

        setProgress(60);
        const payload: UploadPhotoRequest = {
          imageName: effectiveUploadResult.imageName,
          imageUrl: effectiveUploadResult.imageUrl,
          latitude: uploadContext.markerLocation.lat,
          longitude: uploadContext.markerLocation.lng,
          cityName: uploadContext.cityName,
          color: uploadContext.markerColor,
          visibility: !uploadContext.isPrivate,
          memo: uploadContext.description,
        };

        console.log('📤 사진 업로드 요청:', {
          cityName: payload.cityName,
          latitude: payload.latitude,
          longitude: payload.longitude,
        });

        const photoResponse = await uploadPhotoMutate(payload);
        if (isCancelled) return;

        setProgress(80);

        const photoId = photoResponse.result.photoId;
        let nearbySpots: NearbySpotsResponse['result']['spots'] | undefined;

        if (photoId) {
          try {
            const nearbyResult = await nearbyMutate({ photoId });
            if (isCancelled) return;
            nearbySpots = nearbyResult.result?.spots;
          } catch (nearbyError) {
            console.warn('근처 관광지 추천 실패:', nearbyError);
          }
        }

        setProgress(100);

        const successPayload: UploadSuccess = {
          uploadResult: photoResponse.result,
          nearbySpots,
        };

        onSuccess(successPayload);
      } catch (err) {
        if (isCancelled) return;

        console.error('사진 업로드 실패:', err);
        const message =
          err instanceof Error && err.message
            ? err.message
            : '사진 업로드에 실패했습니다. 다시 시도해주세요.';
        setError(message);
      } finally {
        if (!isCancelled) {
          setIsUploading(false);
        }
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [
    attempt,
    hasValidState,
    nearbyMutate,
    onSuccess,
    state,
    uploadContext,
    uploadPhotoMutate,
  ]);

  const retry = () => setAttempt((prev) => prev + 1);

  return { progress, error, isUploading, retry };
}

async function toFile(state: UploadState | undefined): Promise<File> {
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
