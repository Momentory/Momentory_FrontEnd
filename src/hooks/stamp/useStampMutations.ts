import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { issueCulturalStamp } from '../../api/stamp';
import type {
  CulturalStampRequest,
  CulturalStampResponse,
} from '../../types/stamp';

export function useCulturalStamp(
  options?: UseMutationOptions<
    CulturalStampResponse,
    unknown,
    CulturalStampRequest,
    unknown
  >
) {
  return useMutation<
    CulturalStampResponse,
    unknown,
    CulturalStampRequest,
    unknown
  >({
    mutationFn: issueCulturalStamp,
    ...options,
  });
}
