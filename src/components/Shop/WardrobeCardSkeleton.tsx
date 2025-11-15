const WardrobeCardSkeleton = () => {
  return (
    <div className="relative">
      <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-dashed border-gray-300 bg-gray-200 z-10 animate-pulse" />

      <div className="relative w-full overflow-hidden rounded-xl border border-gray-300 bg-white pt-15 px-2 pb-5 shadow-sm aspect-square animate-pulse">
        <div className="relative w-full h-full bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default WardrobeCardSkeleton;
