import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseItem } from '../../api/shop';
import type { ItemCategory } from '../../types/shop';

interface UsePurchaseItemOptions {
  currentCategory?: ItemCategory;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const usePurchaseItem = ({
  currentCategory,
  onSuccess,
  onError
}: UsePurchaseItemOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => purchaseItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPoint'] });
      if (currentCategory) {
        queryClient.invalidateQueries({ queryKey: ['shopItems', currentCategory] });
      }
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      queryClient.invalidateQueries({ queryKey: ['myItems'] });

      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
