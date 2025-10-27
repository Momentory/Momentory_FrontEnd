import { useState } from "react";
import Menu from "../../assets/icons/menuIcon.svg?react";
import Bell from "../../assets/icons/bellIcon.svg?react";
import ActiveBell from "../../assets/icons/bellActiveIcon.svg?react";
import Profile from "../../assets/icons/defaultProfile.svg?react";
import Dropdown from "../../assets/icons/dropdown.svg?react";
import Sidebar from "./SideBar";

// DropdownMenu 타입 정의
interface DropdownMenuProps {
  onClose: () => void;
}

// DropdownMenu 컴포넌트
const DropdownMenu = ({ onClose }: DropdownMenuProps) => {
  return (
    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-md w-32 z-50">
      <ul className="text-sm text-gray-700">
        <li
          onClick={onClose}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          프로필 수정
        </li>
        <li
          onClick={onClose}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          로그아웃
        </li>
      </ul>
    </div>
  );
};

// Header 컴포넌트
const Header = ({
  userName = "Username",
  hasNotification = false,
}: {
  userName?: string;
  hasNotification?: boolean;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <header className="w-full max-w-[480px] flex justify-between items-center px-4 py-3 bg-[#FF7070] shadow-[0px_4px_4px_rgba(0,0,0,0.15)] border-b-[1px] border-white relative">
        {/* 왼쪽: 메뉴 + 알림 */}
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

        {/* 오른쪽: 프로필 + 이름 + ▼ */}
        <div className="relative flex items-center gap-2.5">
          <Profile className="w-8 h-8" />
          <p className="text-white font-medium">{userName}</p>

          {/* ▼ 클릭 시 드롭다운 토글 */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="focus:outline-none"
          >
            <Dropdown className="w-3 text-white cursor-pointer" />
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <DropdownMenu onClose={() => setIsDropdownOpen(false)} />
          )}
        </div>
      </header>

      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;
