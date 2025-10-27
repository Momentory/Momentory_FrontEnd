import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';

const ProtectedLayout = () => {
  const location = useLocation();

  // 캐릭터 페이지일 때는 Header, Navbar 숨기기
  const isFullScreenPage =
    location.pathname === '/character' ||
    location.pathname === '/upload'; // 업로드 화면도 전체로 띄우려면 여기도 포함 가능

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[480px] min-h-screen bg-white flex flex-col">
        {/* Header 숨김 처리 */}
        {!isFullScreenPage && <Header />}

        {/* Outlet (페이지 표시 영역) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Navbar 숨김 처리 */}
        {!isFullScreenPage && <Navbar />}
      </div>
    </div>
  );
};

export default ProtectedLayout;
