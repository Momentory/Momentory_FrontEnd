import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getRecentStamps } from '../../api/stamp';
import type { RecentStampsResponse } from '../../types/stamp';

export const STAMP_QUERY_KEYS = {
  recent: ['stamps', 'recent'] as const,
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
