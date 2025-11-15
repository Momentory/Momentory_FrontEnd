const PlaceSkeleton = () => {
  return (
    <div className="bg-white shadow-md overflow-hidden border-[3px] border-[#F2E8E8] p-5 pb-4 animate-pulse">
      <div className="w-full h-[200px] bg-gray-200 border-[3px] border-gray-300"></div>
      <div className="flex justify-between items-start mt-3.5">
        <div className="h-7 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="flex justify-between items-end mt-3">
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
    </div>
  );
};

export default PlaceSkeleton;
