import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { album } from '../../api/album';

const SharedAlbumPage = () => {
  const { shareUuid } = useParams();
  const bookRef = useRef<any>(null);
  const [current, setCurrent] = useState(0);
  const [viewport, setViewport] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const FlipBook = HTMLFlipBook as unknown as any;

  // 목업 데이터 사용 여부 (shareUuid가 'mock'이면 목업 사용)
  const useMockData = shareUuid === 'mock';

  useEffect(() => {
    if (!shareUuid) return;

    const fetchSharedAlbum = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 목업 데이터 사용
        if (useMockData) {
          await new Promise(resolve => setTimeout(resolve, 500));

          setImageUrls([
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=700&fit=crop',
            'https://images.unsplash.com/photo-1586500036706-41963de24d97?w=400&h=700&fit=crop',
            'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=400&h=700&fit=crop',
            'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=700&fit=crop'
          ]);
          setIsLoading(false);
          return;
        }

        // 실제 API 호출
        const response = await album.getSharedAlbum(shareUuid);

        if (response.isSuccess && response.result) {
          const { images: albumImages } = response.result;
          const sortedImages = albumImages
            .sort((a, b) => a.index - b.index)
            .map(img => img.imageUrl);
          setImageUrls(sortedImages);
        } else {
          setError('앨범을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('공유 앨범 조회 실패:', err);
        setError('앨범을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedAlbum();
  }, [shareUuid, useMockData]);

  const pages = useMemo(() => imageUrls, [imageUrls]);

  const handlePrev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const handleNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  useEffect(() => {
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">앨범을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-500 text-sm">링크가 유효하지 않거나 공유가 해제되었습니다.</p>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">표시할 이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100">
      <div className="absolute inset-0 flex items-center justify-center">
        {(() => {
          const minWidth = 280;
          const maxWidth = 480;
          const ratio = 16 / 9;
          const width = Math.min(maxWidth, Math.max(minWidth, viewport.width));
          const idealHeight = Math.round(width * ratio);
          const height = Math.min(viewport.height, idealHeight);

          return (
            <FlipBook
              width={width}
              height={height}
              size="fixed"
              showCover
              className="overflow-hidden bg-white"
              ref={bookRef}
              onFlip={(e: any) => setCurrent(e.data)}
            >
              {pages.map((url, idx) => (
                <div key={idx} className="w-full h-full">
                  <img
                    src={url}
                    alt={`page-${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </FlipBook>
          );
        })()}

        <button
          aria-label="prev"
          className="absolute inset-y-0 left-0 w-1/3 cursor-pointer"
          onClick={handlePrev}
        />
        <button
          aria-label="next"
          className="absolute inset-y-0 right-0 w-1/3 cursor-pointer"
          onClick={handleNext}
        />
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[#333] text-sm">
        <span className="px-3 py-1 rounded-full bg-black/5">
          {current + 1} / {pages.length}
        </span>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-gray-400">
          Made by Momentory
        </p>
        <a
          href="https://momentoryy.vercel.app"
          className="text-xs text-[#FF7070] hover:underline"
        >
          나도 앨범 만들기 →
        </a>
      </div>
    </div>
  );
};

export default SharedAlbumPage;
