import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import CreateAlbumIcon from '../../assets/icons/addAlbum.svg?react';
import ShopIcon from '../../assets/icons/shopIcon.svg?react';
import ClosetIcon from '../../assets/icons/closetIcon.svg?react';
import GalleryIcon from '../../assets/icons/galleryIcon.svg?react';
import AlbumList from '../../components/MyAlbum/AlbumList';
import { album } from '../../api/album';
import { toS3WebsiteUrl } from '../../utils/s3';
import type { AlbumListItem } from '../../types/album';

const MyAlbumPage = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<AlbumListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await album.getMyAlbums();
        
        if (response.isSuccess && response.result) {
          setAlbums(response.result);
        } else {
          throw new Error(response.message || '앨범 목록을 불러오지 못했습니다.');
        }
      } catch (err: any) {
        console.error('Fetch Albums Error:', err);
        setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const transformedAlbums = albums.map(album => ({
    id: album.id,
    // S3 REST Endpoint를 Website Endpoint로 변환 (CORS 해결)
    imgSrc: toS3WebsiteUrl(album.thumbnailUrl),
    date: new Date(album.createdAt).toLocaleDateString('ko-KR'),
    location: album.title,
  }));

  return (
    <>
      <DropdownHeader title="나의 사진첩" />
      <div className="p-8">
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button
            className="bg-[#FF7070] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => navigate('/create-album')}
          >
            <CreateAlbumIcon className="w-16 h-16" />
            <p className="text-center mt-2.5 text-white font-bold text-base">앨범 생성</p>
          </button>

          <button
            className="bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#DDDDDD] flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => navigate('/shop')}
          >
            <ShopIcon className="w-16 h-16" />
            <p className="text-center mt-2.5 text-[#9c9c9c] font-bold text-base">아이템 상점</p>
          </button>

          <button
            className="bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#DDDDDD] flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => navigate('/closet')}
          >
            <ClosetIcon className="w-16 h-16" />
            <p className="text-center mt-2.5 text-[#9c9c9c] font-bold text-base">캐릭터 옷장</p>
          </button>

          <button
            className="bg-[#FF7070] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => navigate('/gallery')}
          >
            <GalleryIcon className="w-16 h-16" />
            <p className="text-center mt-2.5 text-white font-bold text-base">사진 기록</p>
          </button>
        </div>

        <hr className="text-[#EBEBEB] border-t-3" />

        <div className="mb-10">
          <p className="text-xl font-extrabold text-[#444444] my-6">내가 생성한 앨범</p>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-600">앨범을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-10 bg-red-100 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-10 gap-4">
              <p className="text-gray-600 text-lg">아직 생성한 앨범이 없습니다!</p>
              <button
                onClick={() => navigate('/create-album')}
                className="text-[#FF7070] font-bold text-base flex items-center gap-1"
              >
                + 앨범 생성하러 가기
              </button>
            </div>
          ) : (
            <AlbumList albums={transformedAlbums} />
          )}
        </div>
      </div>
    </>
  );
};

export default MyAlbumPage;