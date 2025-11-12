import { useQuery } from '@tanstack/react-query';
import { getWardrobeList } from '../../api/shop';

export const useWardrobeList = () => {
  return useQuery({
    queryKey: ['wardrobes'],
    queryFn: getWardrobeList,
  });
};
