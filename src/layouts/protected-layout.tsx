import { useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';
import PhotoUploadBottomSheet from '../components/PhotoUpload/PhotoUploadBottomSheet';

const ProtectedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isEditPage = location.pathname.startsWith('/edit/');
  const isAlbumPage = location.pathname.startsWith('/album/');
  const isCreateAlbumPage = location.pathname.startsWith('/create-album');
  const isAlbumReadPage = location.pathname.includes('/read');
  const isShopPage = location.pathname.startsWith('/shop');
  const isClosetPage = location.pathname.startsWith('/closet');

  const [isUploadBottomSheetOpen, setIsUploadBottomSheetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      navigate('/upload', {
        state: { selectedImage: reader.result as string },
      });
      setIsUploadBottomSheetOpen(false);
    };
    reader.onerror = () => alert('이미지를 불러오는데 실패했습니다.');
    reader.readAsDataURL(file);
  };

  const isHeaderHidden =
    location.pathname.startsWith('/settings') || isAlbumReadPage;

  const isNavbarHidden =
    location.pathname.startsWith('/settings') ||
    isShopPage ||
    isClosetPage ||
    isEditPage ||
    isAlbumPage ||
    isCreateAlbumPage;

  const hasDropdownHeader = [
    '/album',
    '/create-album',
    '/edit',
    '/myMap',
    '/publicMap',
    '/roulette',
    '/share',
    '/upload',
    '/photo-edit',
    '/recommended-places',
  ].some((path) => location.pathname.startsWith(path));

  const isUploadFlow = [
    '/photo-upload-progress',
    '/photo-upload-success',
    '/photo-upload-complete',
    '/stamp-acquisition',
    '/question',
    '/authentication',
    '/auth-error-resolution',
  ].some((path) => location.pathname.startsWith(path));

  const isCameraMode = location.state?.cameraStream === true;

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[480px] min-h-screen bg-white">
        {!isUploadFlow && !isHeaderHidden && <Header />}

        <div className={hasDropdownHeader && !isUploadFlow ? 'pt-[112px]' : ''}>
          <Outlet />
        </div>

        {!isNavbarHidden && !isCameraMode && !isUploadFlow && (
          <Navbar onUploadClick={() => setIsUploadBottomSheetOpen(true)} />
        )}
      </div>

      {isUploadBottomSheetOpen && (
        <PhotoUploadBottomSheet
          onClose={() => setIsUploadBottomSheetOpen(false)}
          onGalleryClick={() => fileInputRef.current?.click()}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ProtectedLayout;