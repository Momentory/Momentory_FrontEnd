import { useEffect, useRef, useMemo, useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import PhotoDetailModal from '../../components/MyAlbum/PhotoDetailModal';
import { useMyPhotos } from '../../hooks/useMyPhotos';
import { toS3WebsiteUrl } from '../../utils/s3';
import type { MyPhoto } from '../../types/album';

const GalleryPage = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<MyPhoto | null>(null);

  const {
    data: photosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useMyPhotos(20);

  const photos = useMemo(() => {
    if (!photosData?.pages) return [];
    return photosData.pages.flatMap(page =>
      page.photos.map(photo => ({
        ...photo,
        imageUrl: toS3WebsiteUrl(photo.imageUrl),
      }))
    );
  }, [photosData]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasNextPage || isFetchingNextPage) return;

      const scrollElement = document.documentElement;
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-[#EDE2E2]">
      <DropdownHeader title="사진 기록" />
      <div ref={scrollRef} className="p-8 pb-20 pt-[130px]">
        {isLoading && (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-300 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-red-500 mb-2">사진을 불러오는데 실패했습니다</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.photoId}
                  className="cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.memo || '사진'}
                    className="w-full h-auto rounded-lg hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>

            {isFetchingNextPage && (
              <div className="py-8 text-center">
                <p className="text-gray-500 text-sm">이미지를 불러오는 중...</p>
              </div>
            )}

            {photos.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-gray-400">업로드된 사진이 없습니다</p>
              </div>
            )}
          </>
        )}
      </div>

      <PhotoDetailModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
};

export default GalleryPage;
