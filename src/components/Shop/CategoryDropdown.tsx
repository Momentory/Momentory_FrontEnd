import React from 'react';
import ChevronDown from '../../assets/icons/dropdown.svg?react';

interface CategoryDropdownProps {
  selectedCategory: string;
  onCategoryChange?: (category: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const categories = [
    { key: 'DECORATION', label: '장식' },
    { key: 'CLOTHING', label: '의상' },
    { key: 'EXPRESSION', label: '표정' },
    { key: 'EFFECT', label: '이펙트' },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside as any);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, [isOpen]);

  const handleSelect = (categoryKey: string) => {
    onCategoryChange?.(categoryKey);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-4 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <span className="text-2xl font-extrabold text-[#444444]">
          {selectedCategory}
        </span>
        <ChevronDown
          className={`w-3 h-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] border border-zinc-400 z-[40]"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col px-2.5 py-1.5">
            {categories.map((category, index) => (
              <React.Fragment key={category.key}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(category.key);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="text-left text-[#727272] text-xs font-bold tracking-tight px-6 py-3"
                >
                  {category.label}
                </button>
                {index < categories.length - 1 && (
                  <hr className="border-t border-stone-300" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
