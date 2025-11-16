import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { issueCulturalStamp } from '../../api/stamp';
import type {
  CulturalStampRequest,
  CulturalStampResponse,
} from '../../types/stamp';
import { STAMP_QUERY_KEYS } from './useStampQueries';

export function useCulturalStamp(
  options?: UseMutationOptions<
    CulturalStampResponse,
    unknown,
    CulturalStampRequest,
    unknown
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    CulturalStampResponse,
    unknown,
    CulturalStampRequest,
    unknown
  >({
    mutationFn: issueCulturalStamp,
    onSuccess: async (data, variables, context, mutationContext) => {
      // 문화 스탬프 발급 후 최근 스탬프 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: STAMP_QUERY_KEYS.recent });
      await queryClient.invalidateQueries({ queryKey: STAMP_QUERY_KEYS.my('CULTURAL') });
      await queryClient.invalidateQueries({ queryKey: STAMP_QUERY_KEYS.my() });

      // 사용자가 제공한 onSuccess도 호출
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context, mutationContext);
      }
    },
    ...options,
  });
}
