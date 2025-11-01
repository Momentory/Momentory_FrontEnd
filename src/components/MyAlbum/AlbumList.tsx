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
    <div className="flex gap-5 overflow-x-auto pb-4">
      {albums.map(album => (
        <AlbumCard
          key={album.id}
          id={album.id}
          imgSrc={album.imgSrc}
          date={album.date}
          location={album.location}
        />
      ))}
    </div>
  );
};

export default AlbumList;