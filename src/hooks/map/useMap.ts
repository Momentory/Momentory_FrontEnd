import { useQuery } from '@tanstack/react-query';
import {
  getMyMapRegionColors,
  getMyMapLatestPhotos,
  getMyRegionPhotos,
  getPublicMapLatestPhotos,
  getPublicRegionPhotos,
  getMyAllPhotos,
  getPublicAllPhotos,
} from '../../api/map';

// Query Key Factory: 키를 한곳에서 관리하여 오타 방지 및 일관성 유지
export const MAP_KEYS = {
  all: ['map'] as const,
  my: () => [...MAP_KEYS.all, 'my'] as const,
  myColors: () => [...MAP_KEYS.my(), 'colors'] as const,
  myLatest: () => [...MAP_KEYS.my(), 'latest'] as const,
  myAllPhotos: () => [...MAP_KEYS.my(), 'allPhotos'] as const,
  myDetail: (region: string) => [...MAP_KEYS.my(), 'detail', region] as const,
  public: () => [...MAP_KEYS.all, 'public'] as const,
  publicLatest: () => [...MAP_KEYS.public(), 'latest'] as const,
  publicAllPhotos: () => [...MAP_KEYS.public(), 'allPhotos'] as const,
  publicDetail: (region: string) =>
    [...MAP_KEYS.public(), 'detail', region] as const,
};

/**
 * [내 지도] 방문한 지역 색상 정보 조회 훅
 */
export const useMyMapColors = () => {
  return useQuery({
    queryKey: MAP_KEYS.myColors(),
    queryFn: getMyMapRegionColors,
    staleTime: 1000 * 60 * 5, // 5분간 데이터 신선함 유지 (필요에 따라 조절)
  });
};

/**
 * [내 지도] 모든 지역 최신 사진 조회 훅 (클러스터링용)
 */
export const useMyMapLatestPhotos = () => {
  return useQuery({
    queryKey: MAP_KEYS.myLatest(),
    queryFn: getMyMapLatestPhotos,
  });
};

/**
 * [내 지도] 특정 지역 사진 상세 조회 훅
 * @param regionName 지역명 (선택 시 활성화)
 */
export const useMyRegionPhotos = (regionName: string | null) => {
  return useQuery({
    queryKey: MAP_KEYS.myDetail(regionName ?? ''),
    queryFn: () => getMyRegionPhotos(regionName!),
    enabled: !!regionName, // regionName이 있을 때만 쿼리 실행
  });
};

/**
 * [전체 지도] 모든 지역 최신 공개 사진 조회 훅
 */
export const usePublicMapLatestPhotos = () => {
  return useQuery({
    queryKey: MAP_KEYS.publicLatest(),
    queryFn: getPublicMapLatestPhotos,
  });
};

/**
 * [전체 지도] 특정 지역 공개 사진 상세 조회 훅
 * @param regionName 지역명 (선택 시 활성화)
 */
export const usePublicRegionPhotos = (regionName: string | null) => {
  return useQuery({
    queryKey: MAP_KEYS.publicDetail(regionName ?? ''),
    queryFn: () => getPublicRegionPhotos(regionName!),
    enabled: !!regionName, // regionName이 있을 때만 쿼리 실행
  });
};

/**
 * [내 지도] 모든 지역 사진 조회 훅
 */
export const useMyAllPhotos = (enabled = true) => {
  return useQuery({
    queryKey: MAP_KEYS.myAllPhotos(),
    queryFn: getMyAllPhotos,
    enabled,
  });
};

/**
 * [전체 지도] 모든 지역 공개 사진 조회 훅
 */
export const usePublicAllPhotos = (enabled = true) => {
  return useQuery({
    queryKey: MAP_KEYS.publicAllPhotos(),
    queryFn: getPublicAllPhotos,
    enabled,
  });
};
