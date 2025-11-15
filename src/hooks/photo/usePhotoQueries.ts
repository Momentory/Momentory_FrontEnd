import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getPhoto, getLocationToAddress } from '../../api/photo';
import type {
  PhotoResponse,
  LocationToAddressResponse,
} from '../../types/photo';

const PHOTO_QUERY_KEYS = {
  detail: (photoId: number) => ['photo', photoId] as const,
  locationToAddress: (latitude: number, longitude: number) =>
    ['photo', 'location-to-address', latitude, longitude] as const,
};

type PhotoDetailQueryKey = ReturnType<typeof PHOTO_QUERY_KEYS.detail>;
type LocationQueryKey = ReturnType<typeof PHOTO_QUERY_KEYS.locationToAddress>;

type PhotoDetailOptions = Omit<
  UseQueryOptions<PhotoResponse, unknown, PhotoResponse, PhotoDetailQueryKey>,
  'queryKey' | 'queryFn'
>;

type LocationToAddressOptions = Omit<
  UseQueryOptions<
    LocationToAddressResponse,
    unknown,
    LocationToAddressResponse,
    LocationQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function usePhotoDetail(photoId: number, options?: PhotoDetailOptions) {
  return useQuery<PhotoResponse, unknown, PhotoResponse, PhotoDetailQueryKey>({
    queryKey: PHOTO_QUERY_KEYS.detail(photoId),
    queryFn: () => getPhoto(photoId),
    enabled: Number.isFinite(photoId), // photoId가 유효할 때만 실행
    ...options,
  });
}

export function useLocationToAddress(
  latitude: number | undefined,
  longitude: number | undefined,
  options?: LocationToAddressOptions
) {
  const enabled =
    latitude !== undefined &&
    !Number.isNaN(latitude) &&
    longitude !== undefined &&
    !Number.isNaN(longitude);

  return useQuery<
    LocationToAddressResponse,
    unknown,
    LocationToAddressResponse,
    LocationQueryKey
  >({
    queryKey: PHOTO_QUERY_KEYS.locationToAddress(
      (latitude ?? 0) as number,
      (longitude ?? 0) as number
    ),
    queryFn: () =>
      getLocationToAddress(latitude as number, longitude as number),
    enabled, // 위도, 경도가 모두 유효할 때만 실행
    ...options,
  });
}
