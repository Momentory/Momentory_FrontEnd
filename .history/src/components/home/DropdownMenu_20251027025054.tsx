interface DropdownMenuProps {
  onClose: () => void;
}

export default function DropdownMenu({ onClose }: DropdownMenuProps) {
  return (
    <div className="absolute right-0 top-[30px] bg-white border shadow-md rounded-[10px] text-[13px] w-[130px] overflow-hidden z-50">
      <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
        프로필 수정
      </button>
      <button
        onClick={() => {
          onClose();
          alert("로그아웃되었습니다.");
        }}
        className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
      >
        로그아웃
      </button>
    </div>
  );
}
