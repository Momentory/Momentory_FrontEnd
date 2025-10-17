import Menu from '../../assets/icons/menuIcon.svg?react';
import Bell from '../../assets/icons/bellIcon.svg?react';
import ActiveBell from '../../assets/icons/bellActiveIcon.svg?react';
import Profile from '../../assets/icons/defaultProfile.svg?react';
import Dropdown from '../../assets/icons/dropdown.svg?react';

const Header = ({ userName = 'Username', hasNotification = false }) => {
  return (
    <header className="w-full max-w-[480px] flex justify-between items-center px-4 py-3 bg-[#FF7070] shadow-[0px_4px_4px_rgba(0,0,0,0.15)] border-b-[1px] border-white">
      <div className="flex items-center gap-3">
        <Menu />
        {hasNotification ? (
          <ActiveBell className="w-7.5 h-7.5 text-white" />
        ) : (
          <Bell className="w-7.5 h-7.5 text-white" />
        )}
      </div>
      <div className="flex items-center gap-2.5">
        <Profile className="w-8.5 h-8.5" />
        <p className="text-white font-medium">{userName}</p>
        <Dropdown className="w-2 text-white" />
      </div>
    </header>
  );
};

export default Header;
