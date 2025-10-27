// src/components/home/DropdownMenu.tsx
import { useNavigate } from "react-router-dom";

interface DropdownMenuProps {
  onClose: () => void;
}

export default function DropdownMenu({ onClose }: DropdownMenuProps) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile"); // 프로필 수정 페이지로 이동
    onClose();
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    navigate("/signinscreen"); // 로그인 화면으로 이동
    onClose();
  };

  return (
    <div className="absolute top-8 right-0 w-[150px] bg-white shadow-md rounded-lg border border-gray-200 z-50">
      <ul className="flex flex-col text-[14px] font-medium text-gray-700">
        <li
          onClick={handleProfileClick}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          프로필 수정
        </li>
        <li className="border-t border-gray-200"></li>
        <li
          onClick={handleLogoutClick}
          className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer"
        >
          로그아웃
        </li>
      </ul>
    </div>
  );
}
