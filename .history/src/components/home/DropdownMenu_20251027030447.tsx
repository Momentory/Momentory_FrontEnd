// components/home/DropdownMenu.tsx
export default function DropdownMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="bg-white text-gray-800 rounded-[10px] shadow-lg border w-[150px] overflow-hidden z-50"
      role="menu"
    >
      <button className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-100" role="menuitem">
        프로필 수정
      </button>
      <button
        onClick={() => {
          onClose();
          // TODO: 실제 로그아웃 로직 연결
          alert("로그아웃되었습니다.");
        }}
        className="w-full text-left px-3 py-2 text-[13px] text-red-500 hover:bg-gray-100"
        role="menuitem"
      >
        로그아웃
      </button>
    </div>
  );
}
