import { api } from './client';
import type {
  CulturalStampRequest,
  CulturalStampResponse,
  RecentStampsResponse,
} from '../types/stamp';

/**
 * 문화 스탬프 발급
 * @param payload 문화 관광지 명
 * @returns 발급 결과 문자열 (예: 인증 코드 등)
 */
export const issueCulturalStamp = async (
  payload: CulturalStampRequest
): Promise<CulturalStampResponse> => {
  try {
    const res = await api.post<CulturalStampResponse>(
      '/api/stamps/cultural',
      payload
    );
    return res.data;
  } catch (error) {
    console.error('문화 스탬프 발급 실패', error);
    throw error;
  }
};

/**
 * 최근 획득한 스탬프 목록 조회 (최대 3개)
 */
export const getRecentStamps = async (): Promise<RecentStampsResponse> => {
  try {
    const res = await api.get<RecentStampsResponse>('/api/stamps/recent');
    return res.data;
  } catch (error) {
    console.error('최근 스탬프 조회 실패', error);
    throw error;
  }
};
