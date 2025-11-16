import { api } from './client';
import type {
  CurrentCharacterResponse,
  EquipItemResponse,
  UnequipItemResponse,
  AllCharacterTypesResponse,
  MyCharactersResponse,
  CreateCharacterRequest,
  CreateCharacterResponse,
  SelectCharacterResponse,
  PointHistoryResponse
} from '../types/character';

export const getCurrentCharacter = async () => {
  const { data } = await api.get<CurrentCharacterResponse>('/api/characters/current');
  return data.result;
};

export const equipItem = async (characterId: number, itemId: number) => {
  const { data } = await api.patch<EquipItemResponse>(`/api/characters/${characterId}/equip/${itemId}`);
  return data.result;
};

export const unequipItem = async (characterId: number, itemId: number) => {
  const { data } = await api.patch<UnequipItemResponse>(`/api/characters/${characterId}/unequip/${itemId}`);
  return data.result;
};

// 전체 캐릭터 타입 조회
export const getAllCharacterTypes = async () => {
  const { data } = await api.get<AllCharacterTypesResponse>('/api/characters');
  return data.result;
};

// 사용자가 보유한 전체 캐릭터 조회
export const getMyCharacters = async () => {
  const { data } = await api.get<MyCharactersResponse>('/api/characters/me');
  return data.result;
};

// 캐릭터 생성
export const createCharacter = async (request: CreateCharacterRequest) => {
  const { data } = await api.post<CreateCharacterResponse>('/api/characters', request);
  return data.result;
};

// 캐릭터 선택
export const selectCharacter = async (characterId: number) => {
  const { data } = await api.patch<SelectCharacterResponse>(`/api/characters/${characterId}/select`);
  return data.result;
};

// 포인트 내역 조회
export const getPointHistory = async () => {
  const { data } = await api.get<PointHistoryResponse>('/api/point/history');
  return data.result.points;
};
