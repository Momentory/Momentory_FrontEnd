import { api } from './client';
import type { MapPhoto, RegionColorMap, RegionPhotoMap } from '../types/map';

interface MapApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 내 지도 - 방문한 지역의 색깔 정보 조회
export const getMyMapRegionColors = async (): Promise<RegionColorMap> => {
  try {
    const res = await api.get<MapApiResponse<RegionColorMap>>('/api/map/my');
    return res.data.result ?? {};
  } catch (error) {
    console.error('내 지도 색상 정보 조회 실패', error);
    throw error;
  }
};

// 내 지도 - 모든 지역 내 최신 사진 조회
export const getMyMapLatestPhotos = async (): Promise<RegionPhotoMap> => {
  try {
    const res =
      await api.get<MapApiResponse<RegionPhotoMap>>('/api/map/my/photos');
    return res.data.result ?? {};
  } catch (error) {
    console.error('내 지도 최신 사진 조회 실패', error);
    throw error;
  }
};

// 내 지도 - 지역별 내 사진 전체 조회
export const getMyRegionPhotos = async (
  regionName: string
): Promise<MapPhoto[]> => {
  try {
    const res = await api.get<MapApiResponse<MapPhoto[]>>(
      '/api/map/my/photos/detail',
      {
        params: { regionName },
      }
    );

    return Array.isArray(res.data.result) ? res.data.result : [];
  } catch (error) {
    console.error('내 지도 지역별 사진 조회 실패', error);
    throw error;
  }
};

// 내 지도 - 전체 지역 사진 모음
export const getMyAllPhotos = async (): Promise<MapPhoto[]> => {
  const regionPhotoMap = await getMyMapLatestPhotos();
  const regionNames = Object.keys(regionPhotoMap);
  if (regionNames.length === 0) {
    return [];
  }

  const allPhotosArrays = await Promise.all(
    regionNames.map((regionName) => getMyRegionPhotos(regionName))
  );

  return allPhotosArrays.flat();
};

// 전체 지도 - 모든 지역 최신 공개 사진 조회
export const getPublicMapLatestPhotos = async (): Promise<RegionPhotoMap> => {
  try {
    const res =
      await api.get<MapApiResponse<RegionPhotoMap>>('/api/map/public');
    return res.data.result ?? {};
  } catch (error) {
    console.error('전체 지도 최신 공개 사진 조회 실패', error);
    throw error;
  }
};

// 전체 지도 - 전체 지역 공개 사진 모음
export const getPublicAllPhotos = async (): Promise<MapPhoto[]> => {
  const regionPhotoMap = await getPublicMapLatestPhotos();
  const regionNames = Object.keys(regionPhotoMap);
  if (regionNames.length === 0) {
    return [];
  }

  const allPhotosArrays = await Promise.all(
    regionNames.map((regionName) => getPublicRegionPhotos(regionName))
  );

  return allPhotosArrays.flat();
};

// 전체 지도 - 지역별 공개 사진 전체 조회
export const getPublicRegionPhotos = async (
  regionName: string
): Promise<MapPhoto[]> => {
  try {
    const res = await api.get<MapApiResponse<MapPhoto[]>>(
      '/api/map/public/photos',
      {
        params: { regionName },
      }
    );

    return Array.isArray(res.data.result) ? res.data.result : [];
  } catch (error) {
    console.error('전체 지도 지역별 공개 사진 조회 실패', error);
    throw error;
  }
};
