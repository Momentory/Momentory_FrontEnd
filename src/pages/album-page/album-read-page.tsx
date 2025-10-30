import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import ExampleImg from '../../assets/icons/exampleAlbum.svg';

export default function AlbumReadPage() {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const bookRef = useRef<any>(null);
  const [current, setCurrent] = useState(0);
  const [viewport, setViewport] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const FlipBook = HTMLFlipBook as unknown as any;

  // TODO: 실제 앨범 이미지 배열로 교체
  const pages = useMemo<number[]>(() => [0, 1, 2, 3, 4], []);

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
              // drawShadow={false}
              className="overflow-hidden bg-white"
              ref={bookRef}
              onFlip={(e: any) => setCurrent(e.data)}
            >
              {pages.map((_, idx) => (
                <div key={idx} className="w-full h-full">
                  <img src={ExampleImg} alt={`page-${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </FlipBook>
          );
        })()}

        {/* 화면 가장자리 터치 영역 */}
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

      {/* 상단 좌측 뒤로 버튼 */}
      <div className="absolute top-0 left-0 p-3">
        <button
          className="px-3 py-1.5 rounded border border-[#e5e5e5] bg-white text-[#333] text-sm active:bg-[#f7f7f7]"
          onClick={() => navigate(-1)}
        >
          뒤로
        </button>
      </div>

      {/* 하단 페이지 표시 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[#333] text-sm">
        <span className="px-3 py-1 rounded-full bg-black/5">
          {current + 1} / {pages.length}
        </span>
      </div>
    </div>
  );
}


