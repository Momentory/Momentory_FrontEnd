import { api } from './client';
import type {
  UploadPhotoRequest,
  UploadPhotoResponse,
  LocationToAddressResponse,
  PhotoResponse,
  UpdatePhotoRequest,
  UpdatePhotoVisibilityResponse,
  NearbySpotsResponse,
  DeletePhotoResponse,
} from '../types/photo';

/**
 * 사용자 지역 가져오기 (위도/경도로 cityName 획득)
 * @param latitude 위도
 * @param longitude 경도
 * @returns 지역 정보 (cityName 포함)
 */
export const getLocationToAddress = async (
  latitude: number,
  longitude: number
): Promise<LocationToAddressResponse> => {
  try {
    const res = await api.post<LocationToAddressResponse>(
      '/api/photos/location-to-address',
      { latitude, longitude }
    );
    return res.data;
  } catch (error) {
    console.error('지역 정보 가져오기 실패', error);
    throw error;
  }
};

/**
 * 사진 업로드 (촬영/갤러리)
 * @param payload 사진 업로드 정보
 * @returns 업로드 결과
 */
export const uploadPhoto = async (
  payload: UploadPhotoRequest
): Promise<UploadPhotoResponse> => {
  try {
    if (!payload.imageName || !payload.imageUrl) {
      throw new Error(
        'imageName과 imageUrl이 필요합니다 (S3 업로드 결과 확인).'
      );
    }

    const res = await api.post<UploadPhotoResponse>('/api/photos', payload);
    return res.data;
  } catch (error) {
    console.error('사진 업로드 실패', error);
    throw error;
  }
};

/**
 * 단일 사진 조회
 * @param photoId 사진 ID
 * @returns 사진 정보
 */
export const getPhoto = async (photoId: number): Promise<PhotoResponse> => {
  try {
    const res = await api.get<PhotoResponse>(`/api/photos/${photoId}`);
    return res.data;
  } catch (error) {
    console.error('사진 조회 실패', error);
    throw error;
  }
};

/**
 * 사진 수정
 * @param photoId 사진 ID
 * @param payload 수정할 정보
 * @returns 수정 결과
 */
export const updatePhoto = async (
  photoId: number,
  payload: UpdatePhotoRequest
): Promise<PhotoResponse> => {
  try {
    const res = await api.patch<PhotoResponse>(
      `/api/photos/${photoId}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error('사진 수정 실패', error);
    throw error;
  }
};

/**
 * 사진 삭제
 * @param photoId 사진 ID
 * @returns 삭제 결과
 */
export const deletePhoto = async (
  photoId: number
): Promise<DeletePhotoResponse> => {
  try {
    const res = await api.delete<DeletePhotoResponse>(`/api/photos/${photoId}`);
    return res.data;
  } catch (error) {
    console.error('사진 삭제 실패', error);
    throw error;
  }
};

/**
 * 사진 공개 여부 변경
 * @param photoId 사진 ID
 * @param visibility 공개 여부
 * @returns 변경 결과
 */
export const updatePhotoVisibility = async (
  photoId: number,
  visibility: boolean
): Promise<UpdatePhotoVisibilityResponse> => {
  try {
    const res = await api.put<UpdatePhotoVisibilityResponse>(
      `/api/photos/${photoId}/visibility`,
      { visibility }
    );
    return res.data;
  } catch (error) {
    console.error('사진 공개 여부 변경 실패', error);
    throw error;
  }
};

/**
 * 업로드 후 근처 관광지 추천 (TourAPI)
 * @param photoId 사진 ID
 * @returns 추천 결과
 */
export const updatePhotoNearby = async (
  photoId: number,
  limit = 4
): Promise<NearbySpotsResponse> => {
  try {
    const res = await api.put<NearbySpotsResponse>(
      `/api/photos/${photoId}/nearby`,
      undefined,
      { params: { limit } }
    );
    return res.data;
  } catch (error) {
    console.error('근처 관광지 추천 실패', error);
    throw error;
  }
};
