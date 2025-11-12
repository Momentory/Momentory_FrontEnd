import { useQuery } from '@tanstack/react-query';
import { getShopItems, getUserPoint, getMyItems } from '../../api/shop';
import { getCurrentCharacter } from '../../api/character';
import type { ItemCategory } from '../../types/shop';

export const useUserPoint = () => {
  return useQuery({
    queryKey: ['userPoint'],
    queryFn: getUserPoint,
  });
};

export const useCurrentCharacter = () => {
  return useQuery({
    queryKey: ['currentCharacter'],
    queryFn: getCurrentCharacter,
  });
};

export const useShopItems = (category?: ItemCategory) => {
  return useQuery({
    queryKey: ['shopItems', category],
    queryFn: () => getShopItems(category),
  });
};

export const useMyItems = (category?: ItemCategory) => {
  return useQuery({
    queryKey: ['myItems', category],
    queryFn: () => getMyItems(category),
  });
};
