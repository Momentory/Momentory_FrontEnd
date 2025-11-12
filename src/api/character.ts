import { api } from './client';
import type {
  CurrentCharacterResponse,
  EquipItemResponse,
  UnequipItemResponse
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
