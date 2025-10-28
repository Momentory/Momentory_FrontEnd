import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      {/* 모바일 화면 중앙 정렬 */}
      <div className="w-full max-w-[480px] min-h-screen bg-white">
        {/* 공통 콘텐츠 영역 */}
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
