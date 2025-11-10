import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import EditIcon from '../../assets/icons/albumEdit.svg?react';
import ShareIcon from '../../assets/icons/albumShare.svg?react';
import { album } from '../../api/album';

const AlbumDetailPage = () => {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleShare = async () => {
    if (!albumId) return;

    try {
      const response = await album.createShareLink(Number(albumId));

      if (response.isSuccess && response.result) {
        const shareUrl = response.result.shareUrl;

        // 클립보드에 복사
        await navigator.clipboard.writeText(shareUrl);
        alert('공유 링크가 복사되었습니다!\n친구에게 링크를 공유해보세요.');
      } else {
        alert('공유 링크 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('공유 링크 생성 실패:', err);
      alert('공유 링크 생성에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (!albumId) return;

    const fetchAlbumDetail = async () => {
      setIsLoading(true);
      try {
        const response = await album.getAlbumDetail(Number(albumId));
        
        if (response.isSuccess && response.result) {
          const { title, images } = response.result;
          setAlbumTitle(title);
          
          if (images.length > 0) {
            const sortedImages = images.sort((a, b) => a.index - b.index);
            setThumbnailUrl(sortedImages[0].imageUrl);
          }
        }
      } catch (err) {
        console.error('앨범 상세 조회 실패:', err);
        alert('앨범을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [albumId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">앨범을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <DropdownHeader title="나의 사진첩" />
      <main className="flex-grow p-11 pb-40 flex flex-col items-center">
        <div className="relative w-full max-w-sm">
          <div className="absolute -top-3 left-6 w-full h-full bg-[#E8CDCD]/60 rounded-3xl z-0 pr-7.5" />
          <div className="relative w-full bg-white rounded-3xl border border-[#353535] shadow-lg overflow-hidden z-5">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={albumTitle}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                <p className="text-gray-400">이미지 없음</p>
              </div>
            )}
          </div>
        </div>
        {albumTitle && (
          <h2 className="mt-6 text-2xl font-bold text-[#444444]">{albumTitle}</h2>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 px-7.5 pb-20 z-30">
        <div className="relative max-w-sm mx-auto">
          <button
            className="w-full rounded-3xl bg-[#FF7070] py-3.5 text-lg font-bold text-white shadow-md transition hover:bg-[#E56363] cursor-pointer"
            onClick={() => navigate(`/album/${albumId}/read`)}
          >
            읽기
          </button>
          <div className="absolute bottom-[calc(100%+1rem)] right-0 flex flex-row gap-3">
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/myalbum/edit/${albumId}`)}
            >
              <EditIcon className="h-6 w-6 text-gray-700" />
            </button>
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-100 cursor-pointer"
              onClick={handleShare}
            >
              <ShareIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AlbumDetailPage;