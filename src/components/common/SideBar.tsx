import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { logout } from "../../api/auth";
import { getMyProfileSummary } from "../../api/mypage";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("Username");
  const [email, setEmail] = useState("example@email.com");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // 프로필 정보 조회
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const profile = await getMyProfileSummary();
          setNickname(profile.nickname);
          setEmail(profile.email);
          setProfileImageUrl(profile.imageUrl);
        } catch (error) {
          console.error("프로필 정보 조회 실패:", error);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      alert("로그아웃되었습니다.");
      navigate("/auth/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    } finally {
      onClose();
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-stone-700/60 z-200 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      ></div>

      <aside
        className={`absolute top-0 left-0 h-full w-[82vw] max-w-[480px] bg-white shadow-lg z-200 transition-transform duration-300 ease-in-out overflow-y-auto 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="bg-[#FF7070] text-white pl-4.5 py-7">
          <div className="flex flex-row items-center gap-2.5">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="프로필"
                className="w-13 h-13 rounded-full object-cover"
              />
            ) : (
              <Profile className="w-13 h-13" />
            )}
            <div className="flex flex-col items-start">
              <p className="text-white text-base font-normal">{nickname}</p>
              <p className="text-xs font-normal text-[#894040]">{email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-5.5 py-7.5 overflow-y-auto text-black">
          <section className="mb-4">
            <p className="text-xs text-[#898989] mb-5 font-bold">사진 & 앨범</p>
            <ul className="text-sm pl-9 space-y-7.5 font-bold">
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/upload")}>
                <ShareIcon className="w-3.5 h-3.5" /> 사진 올리기
              </li>
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/myMap")}>
                <MapIcon className="w-3.5 h-3.5" /> 지도 보기
              </li>
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/album")}>
                <AlbumIcon className="w-3.5 h-3.5" /> 내 앨범
              </li>
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/photo-edit")}>
                <EditIcon className="w-3.5 h-3.5" /> 사진 꾸미기 / 사진 편집
              </li>
            </ul>
          </section>

          <hr className="my-6 text-[#c8c8c8]" />

          <section className="mb-4">
            <p className="text-xs text-[#898989] mb-5 font-bold">캐릭터</p>
            <ul className="text-sm pl-9 space-y-7.5 font-bold">
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/closet")}>
                <CharacterIcon className="w-3.5 h-3.5" /> 내 캐릭터
              </li>
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/collection")}>
                <CollectionIcon className="w-3.5 h-3.5" /> 캐릭터 컬렉션
              </li>
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/shop")}>
                <AccessoryIcon className="w-3.5 h-3.5" /> 액세서리
              </li>
            </ul>
          </section>

          <hr className="my-6 text-[#c8c8c8]" />

          <section className="mb-4">
            <p className="text-xs text-[#898989] mb-5 font-bold">커뮤니티</p>
            <ul className="text-sm pl-9 space-y-7.5 font-bold">
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/community")}>
                <CommunityIcon className="w-3.5 h-3.5" /> 커뮤니티
              </li>
            </ul>
          </section>

          <hr className="my-6 text-[#c8c8c8]" />

          <section>
            <p className="text-xs text-[#898989] mb-5 font-bold">기타</p>
            <ul className="text-sm pl-9 space-y-7.5 font-bold">
              <li className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/settings")}>
                <SettingsIcon className="w-3.5 h-3.5" /> 설정
              </li>
              <li
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleLogoutClick}
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