import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipItem, unequipItem } from '../../api/character';

interface UseEquipItemOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useEquipItem = ({ onSuccess, onError }: UseEquipItemOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ characterId, itemId }: { characterId: number; itemId: number }) =>
      equipItem(characterId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentCharacter'] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

export const useUnequipItem = ({ onSuccess, onError }: UseEquipItemOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ characterId, itemId }: { characterId: number; itemId: number }) =>
      unequipItem(characterId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentCharacter'] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
