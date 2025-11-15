const EventSkeleton = () => {
  return (
    <div className="flex gap-3 overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[calc((100vw-72px)/3)] max-w-[calc((480px-72px)/3)] aspect-[3/4] rounded-[12px] bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
};

export default EventSkeleton;
