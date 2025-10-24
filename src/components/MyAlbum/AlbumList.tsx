import AlbumCard from "./AlbumCard";

interface AlbumData {
  id: number;
  imgSrc: string;
  date: string;
  location: string;
}

interface AlbumListProps {
  albums: AlbumData[];
}

const AlbumList = ({ albums }: AlbumListProps) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      {albums.map(album => (
        <AlbumCard 
          key={album.id} 
          imgSrc={album.imgSrc} 
          date={album.date} 
          location={album.location} 
        />
      ))}
    </div>
  );
};

export default AlbumList;
