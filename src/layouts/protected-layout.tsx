import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';
import UploadModal from '../components/common/UploadModal';
const ProtectedLayout = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const location = useLocation();
  const isEditPage = location.pathname.startsWith('/edit/');

  const hasDropdownHeader = [
    '/album',
    '/create-album',
    '/edit',
    '/myMap',
    '/publicMap',
    '/share',
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[480px] min-h-screen bg-white">
        <Header />
        <div className={hasDropdownHeader ? 'pt-[112px]' : ''}>
          <Outlet />
        </div>
        {!isEditPage && (
          <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />
        )}
      </div>

      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
};

export default ProtectedLayout;
