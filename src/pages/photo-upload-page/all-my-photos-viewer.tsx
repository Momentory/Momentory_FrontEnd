import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackIconSvg from '../../assets/backIcon.svg';
import DefaultProfile from '../../assets/icons/defaultProfile.svg';
import MapPinIcon from '../../assets/mapPin.svg';
import type { MapPhoto } from '../../types/map';

interface LegacyPhoto {
  id: number;
  url: string;
  date: string;
  title: string;
  description: string;
  location: string;
  author: string;
}

interface ViewerPhoto {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  description: string;
  location: string;
  author: string;
}

interface ViewerState {
  photos?: Array<MapPhoto | LegacyPhoto>;
  startIndex?: number;
  isPublic?: boolean;
  regionName?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\.\s?/g, '.');
}

function isMapPhoto(photo: MapPhoto | LegacyPhoto): photo is MapPhoto {
  return 'imageUrl' in photo && 'photoId' in photo;
}

export default function AllMyPhotosViewerPage() {
  const { state } = useLocation() as { state: ViewerState | null };
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const isPublic = state?.isPublic ?? false;
  const regionName = state?.regionName ?? '';

  const normalizedStartIndex = useMemo(() => {
    const length = state?.photos?.length ?? 0;
    if (length === 0) {
      return 0;
    }
    const rawIndex = state?.startIndex ?? 0;
    const modIndex = rawIndex % length;
    return modIndex >= 0 ? modIndex : modIndex + length;
  }, [state?.photos?.length, state?.startIndex]);

  const photos = useMemo<ViewerPhoto[]>(() => {
    const source = state?.photos ?? [];
    if (source.length === 0) {
      return [];
    }

    const normalized = source.map((photo, index) => {
      if (isMapPhoto(photo)) {
        return {
          id: photo.photoId || index + 1,
          imageUrl: photo.imageUrl,
          title:
            photo.imageName ||
            (regionName ? `${regionName}의 사진` : '지도 사진'),
          date: photo.createdAt ? formatDate(photo.createdAt) : '',
          description:
            photo.memo ||
            (isPublic
              ? '설명이 등록되지 않은 공개 사진입니다.'
              : '설명이 등록되지 않은 나의 사진입니다.'),
          location: photo.address || regionName || '경기도',
          author: isPublic ? '공개 사진' : '나의 사진',
        };
      }

      return {
        id: photo.id ?? index + 1,
        imageUrl: photo.url,
        title: photo.title || '사진',
        date: photo.date ?? '',
        description: photo.description || '설명이 등록되지 않은 사진입니다.',
        location: photo.location || regionName || '경기도',
        author: photo.author || (isPublic ? '공개 사진' : '나의 사진'),
      };
    });

    if (normalizedStartIndex === 0) {
      return normalized;
    }

    return [
      ...normalized.slice(normalizedStartIndex),
      ...normalized.slice(0, normalizedStartIndex),
    ];
  }, [state?.photos, isPublic, regionName, normalizedStartIndex]);

  useEffect(() => {
    if (!state?.photos) {
      navigate('/all-my-photos', {
        replace: true,
        state: { isPublic, regionName },
      });
    }
  }, [navigate, state?.photos, isPublic, regionName]);

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
            key={`${photo.id}-${photo.imageUrl}`}
            className="relative flex h-screen w-full snap-start flex-col"
          >
            <img
              src={photo.imageUrl}
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
                  <p className="text-sm font-medium leading-tight text-white/70">
                    {photo.date}
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

