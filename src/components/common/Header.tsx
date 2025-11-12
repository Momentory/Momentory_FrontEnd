import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import Menu from '../../assets/icons/menuIcon.svg?react';
import Bell from '../../assets/icons/bellIcon.svg?react';
import ActiveBell from '../../assets/icons/bellActiveIcon.svg?react';
import Profile from '../../assets/icons/defaultProfile.svg?react';
import Dropdown from '../../assets/icons/dropdown.svg?react';
import Sidebar from './SideBar';

const Header = ({ userName = 'Username', hasNotification = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 페이지가 settings인지 확인
  const isSettingsPage = location.pathname === '/settings';

  return (
    <>
      {/* 공통 헤더 */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex justify-between items-center px-4 py-3 bg-[#FF7070] shadow-[0px_4px_4px_rgba(0,0,0,0.15)] border-b-[1px] border-white z-50">
        {/* 🔹 환경설정 페이지일 경우 */}
        {isSettingsPage ? (
          <div className="relative flex items-center justify-center w-full">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2"
            >
              <ArrowLeft size={22} className="text-white" />
            </button>

            {/* 타이틀 */}
            <h1 className="text-[17px] font-semibold text-white">환경설정</h1>
          </div>
        ) : (
          <>
            {/* 기본 헤더 내용 */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-7 h-7 text-white cursor-pointer" />
              </button>
              {hasNotification ? (
                <ActiveBell className="w-7 h-7 text-white cursor-pointer" />
              ) : (
                <Bell className="w-7 h-7 text-white cursor-pointer" />
              )}
            </div>

            {/* Username + 드롭다운 */}
            <div className="relative flex items-center gap-2.5">
              <Profile className="w-8 h-8" />
              <p className="text-white font-medium">{userName}</p>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="focus:outline-none"
              >
                <Dropdown
                  className={`w-3 text-white cursor-pointer transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-[52px] w-[150px] bg-white text-gray-700 rounded-xl shadow-lg overflow-hidden border z-50 animate-[fadeIn_0.2s_ease-out]">
                  <button
                    onClick={() => {
                      alert('프로필 수정');
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-[14px] hover:bg-gray-50"
                  >
                    프로필 수정
                  </button>
                  <button
                    onClick={() => {
                      alert('로그아웃');
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-[14px] hover:bg-gray-50"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </header>

      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;
