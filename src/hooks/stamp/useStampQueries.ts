import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getRecentStamps, getMyStamps } from '../../api/stamp';
import type {
  RecentStampsResponse,
  MyStampsResponse,
  StampType,
} from '../../types/stamp';

export const STAMP_QUERY_KEYS = {
  recent: ['stamps', 'recent'] as const,
  my: (type?: StampType) => ['stamps', 'my', type] as const,
};

export function useRecentStamps(
  options?: UseQueryOptions<
    RecentStampsResponse,
    unknown,
    RecentStampsResponse,
    typeof STAMP_QUERY_KEYS.recent
  >
) {
  return useQuery<
    RecentStampsResponse,
    unknown,
    RecentStampsResponse,
    typeof STAMP_QUERY_KEYS.recent
  >({
    queryKey: STAMP_QUERY_KEYS.recent,
    queryFn: getRecentStamps,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useMyStamps(
  type?: StampType,
  options?: UseQueryOptions<
    MyStampsResponse,
    unknown,
    MyStampsResponse,
    ReturnType<typeof STAMP_QUERY_KEYS.my>
  >
) {
  return useQuery<
    MyStampsResponse,
    unknown,
    MyStampsResponse,
    ReturnType<typeof STAMP_QUERY_KEYS.my>
  >({
    queryKey: STAMP_QUERY_KEYS.my(type),
    queryFn: () => getMyStamps(type),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
