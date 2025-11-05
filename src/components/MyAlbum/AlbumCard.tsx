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
      className="flex flex-col items-center justify-center cursor-pointer flex-shrink-0"
      onClick={handleClick}
    >
      <img
        src={imgSrc}
        alt="앨범"
        className="w-full h-33 object-cover shadow-[1px_2px_4px_0px_rgba(0,0,0,0.30)] border border-[#A2A2A2]"
      />
      <p className="mt-2 text-[10px] font-bold">{date}</p>
      <p className="mt-1 text-xs font-extrabold">{location}</p>
    </div>
  );
};

export default AlbumCard;
