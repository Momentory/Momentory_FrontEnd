import Navlink from './Navlink';
import Home from '../../../assets/icons/nav-home.svg?react';
import Upload from '../../../assets/icons/nav-plus.svg?react';
import Character from '../../../assets/icons/nav-heart.svg?react';
import Album from '../../../assets/icons/nav-bookmark.svg?react';
import Community from '../../../assets/icons/nav-community.svg?react';

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] flex justify-between px-10 py-5 z-100 bg-white shadow-[0px_-4px_4px_0px_rgba(0,0,0,0.15)]">
      <Navlink to="/home" Icon={Home} alt="홈" />
      <Navlink to="/character" Icon={Character} alt="캐릭터 성장" />

      {/* 업로드 버튼은 페이지 이동이 아니라 모달 트리거 */}
      <button
        type="button"
        className="upload-btn flex flex-col items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // 이동 막고, HomePage useEffect의 upload-btn 리스너가 모달 열게 됨
        }}
      >
        <Upload className="w-6 h-6" />
        <span className="text-[11px] text-gray-600 mt-1"></span>
      </button>

      <Navlink to="/community" Icon={Community} alt="커뮤니티" />
      <Navlink to="/album" Icon={Album} alt="마이페이지" />
    </nav>
  );
};

export default Navbar;
