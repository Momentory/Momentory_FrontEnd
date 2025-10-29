import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[480px] min-h-screen bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
