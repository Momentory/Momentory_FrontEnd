import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveWardrobe, applyWardrobe } from '../../api/shop';

export const useSaveWardrobe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveWardrobe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobes'] });
      alert('현재 스타일이 저장되었습니다!');
    },
    onError: (error) => {
      console.error('옷장 저장 실패:', error);
      alert('옷장 저장에 실패했습니다.');
    },
  });
};

export const useApplyWardrobe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyWardrobe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentCharacter'] });
      alert('스타일이 적용되었습니다!');
    },
    onError: (error) => {
      console.error('스타일 적용 실패:', error);
      alert('스타일 적용에 실패했습니다.');
    },
  });
};
