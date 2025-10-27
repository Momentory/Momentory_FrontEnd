import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';

const ProtectedLayout = () => {
  const location = useLocation();

  // ✅ 캐릭터 화면은 전체화면으로 (Header, Navbar 숨김)
  const isFullScreen =
    location.pathname === '/character' || location.pathname === '/upload';

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[480px] min-h-screen bg-white flex flex-col">
        {/* 헤더 */}
        {!isFullScreen && <Header />}

        {/* 페이지 본문 */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* 하단 네비게이션 */}
        {!isFullScreen && <Navbar />}
      </div>
    </div>
  );
};

export default ProtectedLayout;
