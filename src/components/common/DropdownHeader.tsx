import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronDown from '../../assets/icons/dropdown.svg?react';
import BackIcon from '../../assets/icons/BackIcon.svg?react';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  path: string;
}

interface DropdownHeaderProps {
  title?: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

const DropdownHeader = ({
  title = '',
  hasDropdown = false,
  dropdownItems = [],
}: DropdownHeaderProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(title);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (item: DropdownItem) => {
    setSelectedTitle(item.label);
    setIsOpen(false);
    navigate(item.path);
  };

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <div className="fixed top-[56px] left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40">
      <div className="relative bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.25)] z-10">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            type="button"
            onClick={handleClickBack}
            className="flex items-center justify-center w-6 h-6 cursor-pointer"
          >
            <BackIcon className="w-4 h-4" />
          </button>

          <div
            className={`flex items-center justify-center ${
              hasDropdown ? 'cursor-pointer' : ''
            }`}
            onClick={hasDropdown ? toggleDropdown : undefined}
          >
            <span className="text-xl font-extrabold text-[#444444]">
              {selectedTitle}
            </span>
            {hasDropdown && (
              <ChevronDown
                className={`ml-2.5 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            )}
          </div>

          <div className="w-6 h-6" />
        </div>
      </div>
      <div
        className={`absolute left-0 top-full w-full bg-white rounded-2xl
        shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)]
        overflow-hidden transition-all duration-300 z-20 ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ul className="text-[#808080]">
          {dropdownItems.map((item, index) => (
            <div key={item.path}>
              <li
                onClick={() => handleSelect(item)}
                className="flex items-center px-8 py-5 text-base font-bold hover:bg-gray-100 cursor-pointer"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </li>
              {index < dropdownItems.length - 1 && (
                <hr className="mx-4 text-[#E8DBDB]" />
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownHeader;
