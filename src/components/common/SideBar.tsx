import { useNavigate } from "react-router-dom"; 
import Profile from "../../assets/icons/defaultProfile.svg?react";
import ShareIcon from "../../assets/icons/shareIcon.svg?react";
import MapIcon from "../../assets/icons/mapIcon.svg?react";
import AlbumIcon from "../../assets/icons/bookmarkIcon.svg?react";
import EditIcon from "../../assets/icons/editIcon.svg?react";
import CharacterIcon from "../../assets/icons/heartIcon.svg?react";
import CollectionIcon from "../../assets/icons/bookIcon.svg?react";
import AccessoryIcon from "../../assets/icons/accessoriesIcon.svg?react";
import CommunityIcon from "../../assets/icons/communityIcon.svg?react";
import SettingsIcon from "../../assets/icons/settingsIcon.svg?react";
import LogoutIcon from "../../assets/icons/logoutIcon.svg?react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

const Sidebar = ({
  isOpen,
  onClose,
  userName = "Username",
  userEmail = "example@email.com",
}: SidebarProps) => {
  const navigate = useNavigate(); // 훅 활성화

  const handleSettingsClick = () => { // 설정 클릭 핸들러 추가
    navigate("/settings"); // 설정 페이지로 이동
    onClose(); // 사이드바 닫기
  };

  const handleLogoutClick = () => { // 로그아웃 추가 (선택)
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-stone-700/60 z-200 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      <aside
        className={`absolute top-0 left-0 h-full w-[82vw] max-w-[480px] bg-white shadow-lg z-200 transition-transform duration-300 ease-in-out overflow-y-auto 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="bg-[#FF7070] text-white pl-4.5 py-7">
          <div className="flex flex-row items-center gap-2.5">
            <Profile className="w-13 h-13" />
            <div className="flex flex-col items-start">
              <p className="text-white text-base font-normal">{userName}</p>
              <p className="text-xs font-normal text-[#894040]">{userEmail}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-5.5 py-7.5 overflow-y-auto text-black">
          <section className="mb-4">
            <p className="text-xs text-[#898989] mb-5 font-bold">사진 & 앨범</p>
            <ul className="text-sm pl-9 space-y-7.5 font-bold">
              <li className="flex items-center gap-3 cursor-pointer">
                <ShareIcon className="w-3.5 h-3.5" /> 사진 올리기
              </li>
              <li className="flex items-center gap-3 cursor-pointer">
                <MapIcon className="w-3.5 h-3.5" /> 지도 보기
              </li>
              <li className="flex items-center gap-3 cursor-pointer">
                <AlbumIcon className="w-3.5 h-3.5" /> 내 앨범
              </li>
              <li className="flex items-center gap-3 cursor-pointer">
                <EditIcon className="w-3.5 h-3.5" /> 사진 꾸미기 / 사진 편집
              </li>
            </ul>
          </section>

          <hr className="my-6 text-[#c8c8c8]" />

          <section className="mb-4">
            <p className="text-xs text-[#898989] mb-5 font-bold">캐릭터</p>
            <ul className="text-sm pl-9 space-y-7.5 font-bold">
              <li className="flex items-center gap-3 cursor-pointer">
                <CharacterIcon className="w-3.5 h-3.5" /> 내 캐릭터
              </li>
              <li className="flex items-center gap-3 cursor-pointer">
                <CollectionIcon className="w-3.5 h-3.5" /> 캐릭터 컬렉션
              </li>
              <li className="flex items-center gap-3 cursor-pointer">
                <AccessoryIcon className="w-3.5 h-3.5" /> 액세서리
              </li>
            </ul>
          </section>

          <hr className="my-6 text-[#c8c8c8]" />

          <section className="mb-4">
            <p className="text-xs text-[#898989] mb-5 font-bold">커뮤니티</p>
            <ul className="text-sm pl-9 space-y-7.5 font-bold">
              <li className="flex items-center gap-3 cursor-pointer">
                <CommunityIcon className="w-3.5 h-3.5" /> 커뮤니티
              </li>
            </ul>
          </section>

          <hr className="my-6 text-[#c8c8c8]" />

          <section>
            <p className="text-xs text-[#898989] mb-5 font-bold">기타</p>
            <ul className="text-sm pl-9 space-y-7.5 font-bold">
              <li
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleSettingsClick} // 설정 클릭 이벤트 연결
              >
                <SettingsIcon className="w-3.5 h-3.5" /> 설정
              </li>
              <li
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleLogoutClick} //로그아웃 처리
              >
                <LogoutIcon className="w-3.5 h-3.5" /> 로그아웃
              </li>
            </ul>
          </section>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
