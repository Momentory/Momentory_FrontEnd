interface MapPopupProps {
  onClose: () => void;
}

export default function MapPopup({ onClose }: MapPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-[20px] p-5 w-[80%] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 text-[20px]"
        >
          ✕
        </button>
        <h3 className="text-[16px] font-semibold mb-3 text-center">
          My Gyeonggi Map
        </h3>
        <img src="/images/map-preview.png" alt="지도" className="w-full" />
      </div>
    </div>
  );
}
