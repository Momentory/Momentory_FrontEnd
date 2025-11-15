const ItemCardSkeleton = () => (
  <div className="flex items-center w-full p-5 bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-[#B5B5B5] gap-10 animate-pulse">
    <div className="relative flex-shrink-0">
      <div className="w-20 h-20 rounded-xl border-2 border-[#A4A4A4] bg-gray-200" />
      <div className="absolute top-[-4px] right-[-4px] w-5 h-5 bg-gray-300 rounded-full" />
    </div>

    <div className="flex flex-col items-start gap-2 flex-1">
      <div className="h-7 bg-gray-200 rounded w-32" />
      <div className="h-10 bg-gray-200 rounded-[20px] w-full" />
    </div>
  </div>
);

export default ItemCardSkeleton;
