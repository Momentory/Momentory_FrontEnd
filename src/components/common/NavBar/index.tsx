import Navlink from './Navlink';
import Home from '../../../assets/icons/nav-home.svg?react';
import Upload from '../../../assets/icons/nav-plus.svg?react';
import Map from '../../../assets/icons/nav-map.svg?react';
import Album from '../../../assets/icons/nav-bookmark.svg?react';
import Community from '../../../assets/icons/nav-community.svg?react';

interface NavbarProps {
  onUploadClick: () => void;
}

const Navbar = ({ onUploadClick }: NavbarProps) => {
  return (
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex flex-row justify-between px-12 py-4 z-[100] bg-white shadow-[0px_-4px_4px_0px_rgba(0,0,0,0.15)]"
      style={{
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        bottom: 0
      }}
    >

      <Navlink to="/home" Icon={Home} alt="홈" />
      <Navlink to="/myMap" Icon={Map} alt="탐색" />
      <div onClick={onUploadClick} className="cursor-pointer">
        <Navlink to="#" Icon={Upload} alt="업로드" />
      </div>
      <Navlink to="/community" Icon={Community} alt="커뮤니티" />
      <Navlink to="/album" Icon={Album} alt="마이페이지" />
    </nav>
  );
};

export default Navbar;
