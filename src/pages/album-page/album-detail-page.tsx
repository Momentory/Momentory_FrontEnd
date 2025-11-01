import { useNavigate, useParams } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import EditIcon from '../../assets/icons/albumEdit.svg?react';
import ShareIcon from '../../assets/icons/albumShare.svg?react';
import ExampleImg from '../../assets/icons/exampleAlbum.svg';

const AlbumDetailPage = () => {
  const navigate = useNavigate();
  const { albumId } = useParams();
  return (
    <>
      <DropdownHeader title="나의 사진첩" />
      <main className="flex-grow p-11 pb-40 flex flex-col items-center">
        <div className="relative w-full max-w-sm">
          <div className="absolute -top-3 left-6 w-full h-full bg-[#E8CDCD]/60 rounded-3xl z-0 pr-7.5" />
          <div className="relative w-full bg-white rounded-3xl border border-[#353535] shadow-lg overflow-hidden z-5">
            <img
              src={ExampleImg}
              alt="앨범 대표 이미지"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
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
              onClick={()=> alert('공유 기능 추후 구현.')}
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