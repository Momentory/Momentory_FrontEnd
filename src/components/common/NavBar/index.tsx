import Navlink from './Navlink';
import Home from '../../../assets/icons/nav-home.svg?react';
import Upload from '../../../assets/icons/nav-plus.svg?react';
import Character from '../../../assets/icons/nav-heart.svg?react';
import Album from '../../../assets/icons/nav-bookmark.svg?react';
import Community from '../../../assets/icons/nav-community.svg?react';


interface NavbarProps {
  onUploadClick: () => void; 
}

const Navbar = ({ onUploadClick }: NavbarProps) => {

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] flex justify-between px-10 py-5 z-100 bg-white shadow-[0px_-4px_4px_0px_rgba(0,0,0,0.15)]">
      <Navlink to="/home" Icon={Home} alt="홈" />
      <button onClick={onUploadClick}>
        <Upload className="w-6 h-6" />
      </button>
      <Navlink to="/character" Icon={Character} alt="캐릭터 성장" />
      <Navlink to="/album" Icon={Album} alt="마이페이지지" />
      <Navlink to="/community" Icon={Community} alt="커뮤니티" />
    </nav>
  );
};

export default Navbar;