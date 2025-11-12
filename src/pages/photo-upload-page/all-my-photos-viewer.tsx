import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackIconSvg from '../../assets/backIcon.svg';
import DefaultProfile from '../../assets/icons/defaultProfile.svg';
import MapPinIcon from '../../assets/mapPin.svg';

interface PhotoItem {
  id: number;
  url: string;
  date: string;
  title: string;
  description: string;
  location: string;
  author: string;
}

interface ViewerState {
  photos?: PhotoItem[];
  startIndex?: number;
  isPublic?: boolean;
}

export default function AllMyPhotosViewerPage() {
  const { state } = useLocation() as { state: ViewerState | null };
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const photos = useMemo(
    () =>
      (state?.photos ?? []).map((photo) => ({
        ...photo,
        description:
          photo.description ??
          '기록된 설명이 없습니다. 추후 실제 사용자 데이터와 연결 예정입니다.',
      })),
    [state?.photos]
  );
  const startIndex = state?.startIndex ?? 0;
  const isPublic = state?.isPublic ?? false;

  useEffect(() => {
    if (!state?.photos) {
      navigate('/all-my-photos', { replace: true, state: { isPublic } });
    }
  }, [navigate, state?.photos, isPublic]);

  useEffect(() => {
    if (containerRef.current && photos.length > 0) {
      containerRef.current.scrollTo({
        top: startIndex * window.innerHeight,
        behavior: 'auto',
      });
    }
  }, [startIndex, photos.length]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto h-screen max-w-[480px] bg-black">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-8 top-12 z-50 flex h-10 w-10 items-center justify-center"
        aria-label="뒤로가기"
      >
        <img src={BackIconSvg} alt="뒤로가기" className="h-10 w-10" />
      </button>

      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {photos.map((photo) => (
          <section
            key={photo.id}
            className="relative flex h-screen w-full snap-start flex-col"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

            <div className="relative z-10 mt-auto px-8 pb-10 text-white">
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <img
                  src={DefaultProfile}
                  alt="프로필"
                  className="h-12 w-12 shrink-0"
                />
                <div className="space-y-[2px]">
                  <h2 className="text-xl font-semibold leading-tight">
                    {photo.author}
                  </h2>
                  <p className="text-sm font-medium text-white/70 leading-tight">
                    {photo.date.replace(/\./g, '.')}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/90">
                {photo.description}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-white/80">
                <img src={MapPinIcon} alt="위치" className="h-4 w-4" />
                <span>{photo.location}</span>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
