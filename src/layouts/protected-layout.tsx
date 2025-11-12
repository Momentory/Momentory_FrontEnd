import { useState, useRef, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';
import PhotoUploadBottomSheet from '../components/PhotoUpload/PhotoUploadBottomSheet';
import { uploadFile } from '../api/S3';

const ProtectedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isEditPage = location.pathname.startsWith('/edit/');
  const isAlbumPage = location.pathname.startsWith('/album/');
  const isCreateAlbumPage = location.pathname.startsWith('/create-album');
  const isAlbumReadPage = location.pathname.includes('/read');
  const isShopPage = location.pathname.startsWith('/shop');
  const isClosetPage = location.pathname.startsWith('/closet');
  const isMyClosetPage = location.pathname.startsWith('/my-closet');

  const [isUploadBottomSheetOpen, setIsUploadBottomSheetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || isUploadingImage) return;

      const readFileAsDataURL = (targetFile: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () =>
            reject(new Error('이미지를 불러오는데 실패했습니다.'));
          reader.readAsDataURL(targetFile);
        });

      setIsUploadingImage(true);
      try {
        const [dataUrl, uploadResponse] = await Promise.all([
          readFileAsDataURL(file),
          uploadFile(file),
        ]);

        navigate('/upload', {
          state: {
            selectedImage: dataUrl,
            uploadResult: uploadResponse.result,
            uploadSource: 'gallery',
          },
        });
        setIsUploadBottomSheetOpen(false);
      } catch (error) {
        console.error('이미지 준비 실패:', error);
        alert('이미지를 업로드하지 못했습니다. 다시 시도해주세요.');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsUploadingImage(false);
      }
    },
    [isUploadingImage, navigate]
  );

  const isHeaderHidden =
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/all-my-photos/viewer') ||
    isAlbumReadPage;

  const isNavbarHidden =
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/all-my-photos/viewer') ||
    isShopPage ||
    isClosetPage ||
    isEditPage ||
    isAlbumPage ||
    isMyClosetPage ||
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
    '/region-photos',
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