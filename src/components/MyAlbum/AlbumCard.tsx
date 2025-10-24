interface AlbumCardProps {
  imgSrc: string;
  date: string;
  location: string;
  onClick?: () => void;
}

const AlbumCard = ({ imgSrc, date, location, onClick }: AlbumCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center cursor-pointer" onClick={onClick}>
      <img src={imgSrc} alt="앨범" className="w-full shadow-[1px_2px_4px_0px_rgba(0,0,0,0.30)]"/>
      <p className="mt-2 text-[10px] font-bold">{date}</p>
      <p className="mt-1 text-xs font-extrabold">{location}</p>
    </div>
  );
};

export default AlbumCard;
