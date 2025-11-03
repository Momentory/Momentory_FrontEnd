import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';
import UploadModal from '../components/common/UploadModal';

const ProtectedLayout = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const location = useLocation();

  const isEditPage = location.pathname.startsWith('/edit/');
  const isShopPage = location.pathname.startsWith('/shop');
  const isClosetPage = location.pathname.startsWith('/closet');

  // 설정 페이지에서 Header & Navbar 숨김
  const hideHeaderPaths = ['/settings'];
  const hideNavbarPaths = ['/settings']; // 🔸 추가

  const isHeaderHidden = hideHeaderPaths.some((path) =>
    location.pathname.startsWith(path)
  );
  const isNavbarHidden = hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  ); 

  // Header spacing 여부 (dropdown 포함 페이지)
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

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[480px] min-h-screen bg-white relative">
        {/* 설정 페이지에서는 Header 숨김 */}
        {!isHeaderHidden && <Header />}

        {/* Outlet 콘텐츠 */}
        <div className={hasDropdownHeader ? 'pt-[112px]' : ''}>
          <Outlet />
        </div>

        {/* 설정 페이지에서는 Navbar 숨김 */}
        {!isNavbarHidden && !isShopPage && !isClosetPage && !isEditPage && (
          <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />
        )}
      </div>

      {/* 업로드 모달 */}
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
};

export default ProtectedLayout;
