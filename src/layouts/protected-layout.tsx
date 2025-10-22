import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';

const PublicLayout = () => {
  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-[480px] min-h-screen bg-white'>
        <Header/>
        <Outlet />
        <Navbar />
      </div>
    </div>
  );
};

export default PublicLayout;