import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Profile from "../../assets/icons/defaultProfile.svg?react";
import ShareIcon from "../../assets/icons/shareIcon.svg?react";
import MapIcon from "../../assets/icons/mapIcon.svg?react";
import AlbumIcon from "../../assets/icons/bookmarkIcon.svg?react";
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
    if (!confirm("로그아웃 하시겠습니까?")) {
      return;
    }

    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-stone-700/60 z-[9999] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-screen w-[300px] max-w-[80vw] bg-white shadow-lg z-[10000] transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="bg-[#FF7070] text-white px-5 py-6">
          <div className="flex flex-row items-center gap-3">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="프로필"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Profile className="w-12 h-12" />
            )}
            <div className="flex flex-col items-start">
              <p className="text-white text-base font-semibold tracking-tight">{nickname}</p>
              <p className="text-xs font-normal text-white/70 tracking-tight">{email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-5 py-6 overflow-y-auto text-black">
          <section className="mb-6">
            <p className="text-xs text-[#898989] mb-3 font-semibold tracking-tight">사진 & 앨범</p>
            <ul className="text-sm pl-5 space-y-3 font-normal">
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]" onClick={() => handleNavigate("/upload")}>
                <ShareIcon className="w-4 h-4" /> 사진 올리기
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]" onClick={() => handleNavigate("/myMap")}>
                <MapIcon className="w-4 h-4" /> 지도 보기
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]" onClick={() => handleNavigate("/album")}>
                <AlbumIcon className="w-4 h-4" /> 내 앨범
              </li>
            </ul>
          </section>

          <hr className="my-5 border-[#e5e5e5]" />

          <section className="mb-6">
            <p className="text-xs text-[#898989] mb-3 font-semibold tracking-tight">캐릭터</p>
            <ul className="text-sm pl-5 space-y-3 font-normal">
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]" onClick={() => handleNavigate("/closet")}>
                <CharacterIcon className="w-4 h-4" /> 내 캐릭터
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]" onClick={() => handleNavigate("/character")}>
                <CollectionIcon className="w-4 h-4" /> 캐릭터 컬렉션
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]" onClick={() => handleNavigate("/shop")}>
                <AccessoryIcon className="w-4 h-4" /> 액세서리
              </li>
            </ul>
          </section>

          <hr className="my-5 border-[#e5e5e5]" />

          <section className="mb-6">
            <p className="text-xs text-[#898989] mb-3 font-semibold tracking-tight">커뮤니티</p>
            <ul className="text-sm pl-5 space-y-3 font-normal">
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]" onClick={() => handleNavigate("/community")}>
                <CommunityIcon className="w-4 h-4" /> 커뮤니티
              </li>
            </ul>
          </section>

          <hr className="my-5 border-[#e5e5e5]" />

          <section>
            <p className="text-xs text-[#898989] mb-3 font-semibold tracking-tight">기타</p>
            <ul className="text-sm pl-5 space-y-3 font-normal">
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]" onClick={() => handleNavigate("/settings")}>
                <SettingsIcon className="w-4 h-4" /> 설정
              </li>
              <li
                className="flex items-center gap-3 cursor-pointer hover:text-[#FF7070]"
                onClick={handleLogoutClick}
              >
                <LogoutIcon className="w-4 h-4" /> 로그아웃
              </li>
            </ul>
          </section>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;