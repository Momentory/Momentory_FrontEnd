import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { album } from '../../api/album';

const AlbumReadPage=()=> {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const bookRef = useRef<any>(null);
  const [current, setCurrent] = useState(0);
  const [viewport, setViewport] = useState<{ width: number; height: number }>({ 
    width: 0, 
    height: 0 
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const FlipBook = HTMLFlipBook as unknown as any;

  useEffect(() => {
    if (!albumId) return;

    const fetchAlbumImages = async () => {
      setIsLoading(true);
      try {
        const response = await album.getAlbumDetail(Number(albumId));
        
        if (response.isSuccess && response.result) {
          const { images } = response.result;
          const sortedImages = images
            .sort((a, b) => a.index - b.index)
            .map(img => img.imageUrl);
          setImageUrls(sortedImages);
        }
      } catch (err) {
        console.error('앨범 이미지 불러오기 실패:', err);
        alert('앨범을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumImages();
  }, [albumId]);

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

  if (pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">표시할 이미지가 없습니다.</p>
          <button
            className="px-4 py-2 bg-[#FF7070] text-white rounded-lg"
            onClick={() => navigate(-1)}
          >
            돌아가기
          </button>
        </div>
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

      <div className="absolute top-0 left-0 p-3">
        <button
          className="px-3 py-1.5 rounded border border-[#e5e5e5] bg-white text-[#333] text-sm active:bg-[#f7f7f7]"
          onClick={() => navigate(-1)}
        >
          뒤로
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[#333] text-sm">
        <span className="px-3 py-1 rounded-full bg-black/5">
          {current + 1} / {pages.length}
        </span>
      </div>
    </div>
  );
}
export default AlbumReadPage;