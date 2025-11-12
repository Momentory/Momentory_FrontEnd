import { useInfiniteQuery } from '@tanstack/react-query';
import { album } from '../api/album';

export const useMyPhotos = (pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['myPhotos'],
    queryFn: async ({ pageParam }) => {
      const response = await album.getMyPhotos(pageParam, pageSize);
      if (!response.isSuccess) {
        throw new Error('사진 목록을 불러오는데 실패했습니다.');
      }
      return response.result;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    initialPageParam: undefined as string | undefined,
    retry: 1, 
    staleTime: 1000 * 60 * 5,
  });
};
