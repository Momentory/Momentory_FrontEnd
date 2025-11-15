import { api } from './client';
import type {
  RouletteSlotsResponse,
  RouletteSpinRequest,
  RouletteSpinResponse,
  RouletteHistoryResponse,
  RouletteIncompleteResponse,
} from '../types/roulette';

/* ----------------------------- 룰렛 API ----------------------------- */

// 1. 룰렛 슬롯 조회 (8개)
export const getRouletteSlots = async () => {
  try {
    const res = await api.get<RouletteSlotsResponse>('/api/roulette/slots');
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[getRouletteSlots] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 2. 룰렛 스핀 (200포인트 차감)
export const spinRoulette = async (request: RouletteSpinRequest) => {
  try {
    const res = await api.post<RouletteSpinResponse>(
      '/api/roulette/spin',
      request
    );
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[spinRoulette] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 3. 룰렛 내역 조회
export const getRouletteHistory = async () => {
  try {
    const res = await api.get<RouletteHistoryResponse>(
      '/api/roulette/history'
    );
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[getRouletteHistory] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 4. 미완료 룰렛 목록 조회
export const getIncompleteRoulettes = async () => {
  try {
    const res = await api.get<RouletteIncompleteResponse>(
      '/api/roulette/incomplete'
    );
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[getIncompleteRoulettes] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};
