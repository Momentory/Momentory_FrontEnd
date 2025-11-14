import { useNavigate } from 'react-router-dom';

interface AlbumCardProps {
  id: number;
  imgSrc: string;
  date: string;
  location: string;
}

const AlbumCard = ({ id, imgSrc, date, location }: AlbumCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/album/${id}`);
  };

  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer flex-shrink-0 w-40"
      onClick={handleClick}
    >
      <img
        src={imgSrc}
        alt="앨범"
        className="w-40 h-52 object-cover shadow-[1px_2px_4px_0px_rgba(0,0,0,0.30)] border border-[#A2A2A2] rounded-lg"
      />
      <p className="mt-2 text-[10px] font-bold text-center">{date}</p>
      <p className="mt-1 text-xs font-extrabold text-center truncate w-full px-1">{location}</p>
    </div>
  );
};

export default AlbumCard;
