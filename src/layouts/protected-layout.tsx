import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';
import UploadModal from '../components/common/UploadModal';

const ProtectedLayout = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const location = useLocation();

  // 브랜치 공통
  const isEditPage = location.pathname.startsWith('/edit/');
  const isAlbumPage = location.pathname.startsWith('/album/'); // from b3e9f9 branch
  const isCreateAlbumPage = location.pathname.startsWith('/create-album'); // from b3e9f9 branch
  const isAlbumReadPage = location.pathname.includes('/read'); // from b3e9f9 branch
  const isShopPage = location.pathname.startsWith('/shop');
  const isClosetPage = location.pathname.startsWith('/closet');

  // 설정 페이지에서 Header & Navbar 숨김 
  const hideHeaderPaths = ['/settings'];
  const hideNavbarPaths = ['/settings']; 

  // Header 숨김 조건 통합 (b3e9f9의 isAlbumReadPage 추가)
  const isHeaderHidden =
    hideHeaderPaths.some((path) => location.pathname.startsWith(path)) ||
    isAlbumReadPage; // from b3e9f9 branch

  // Navbar 숨김 조건 통합 (b3e9f9의 album 관련 조건 추가)
  const isNavbarHidden =
    hideNavbarPaths.some((path) => location.pathname.startsWith(path)) ||
    isShopPage ||
    isClosetPage ||
    isEditPage ||
    isAlbumPage || // from b3e9f9 branch
    isCreateAlbumPage; // from b3e9f9 branch

  // Header spacing 포함 페이지 
  const hasDropdownHeader = [
    '/album',
    '/create-album',
    '/edit',
    '/myMap',
    '/publicMap',
    '/share',
    '/shop',
    '/closet',
  ].some((path) => location.pathname.startsWith(path));

  // 통합된 최종 return 구조
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[480px] min-h-screen bg-white relative"> {/* relative 유지 from HEAD */}
        
        {/* Header (isHeaderHidden 로직 통합됨) */}
        {!isHeaderHidden && <Header />}

        {/* Outlet  */}
        <div className={hasDropdownHeader ? 'pt-[112px]' : ''}>
          <Outlet />
        </div>

        {/* Navbar (isNavbarHidden 로직 통합됨) */}
        {!isNavbarHidden && (
          <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />
        )}
      </div>

      {/* 업로드 모달  */}
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
};

export default ProtectedLayout;
