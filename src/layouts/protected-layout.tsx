import { useState } from "react";
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/NavBar';
import UploadModal from "../components/common/UploadModal";
const ProtectedLayout = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 

  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-[480px] min-h-screen bg-white'>
        <Header/>
        <Outlet />
        <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />
      </div>
      
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
};  

export default ProtectedLayout;