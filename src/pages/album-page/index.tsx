import { useNavigate } from "react-router-dom";
import DropdownHeader from "../../components/common/DropdownHeader";
import CreateAlbumIcon from "../../assets/icons/addAlbum.svg?react";
import ShopIcon from "../../assets/icons/shopIcon.svg?react";
import SeedIcon from "../../assets/icons/seedIcon.svg?react";
import RouletteIcon from "../../assets/icons/starIcon.svg?react";
import ExampleAlbum from "../../assets/icons/exampleAlbum.svg";
import AlbumList from "../../components/MyAlbum/AlbumList";

const MyAlbumPage = () => {
  const navigate = useNavigate();

  // 임시 앨범 데이터
  const albums = [
    { id: 1, imgSrc: ExampleAlbum, date: "2025.10.24", location: "경기도 김포시" },
    { id: 2, imgSrc: ExampleAlbum, date: "2025.10.24", location: "경기도 김포시" },
    { id: 3, imgSrc: ExampleAlbum, date: "2025.10.24", location: "경기도 김포시" },
  ];

  return (
    <>
      <DropdownHeader title="나의 사진첩" />
      <div className="p-8">
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button
            className="bg-[#FF7070] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => navigate("/create-album")}
          >
            <CreateAlbumIcon className="w-16 h-16" />
            <p className="text-center mt-2.5 text-white font-bold text-base">앨범 생성</p>
          </button>

          <button
            className="bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#DDDDDD] flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => navigate("/shop")}
          >
            <ShopIcon className="w-16 h-16" />
            <p className="text-center mt-2.5 text-[#9c9c9c] font-bold text-base">아이템 상점</p>
          </button>

          <button
            className="bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#DDDDDD] flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => navigate("/growth-diary")}
          >
            <SeedIcon className="w-16 h-16" />
            <p className="text-center mt-2.5 text-[#9c9c9c] font-bold text-base">성장 일기</p>
          </button>

          <button
            className="bg-[#FF7070] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => navigate("/roulette")}
          >
            <RouletteIcon className="w-16 h-16" />
            <p className="text-center mt-2.5 text-white font-bold text-base">룰렛</p>
          </button>
        </div>

        <hr className="text-[#EBEBEB] h-2" />

        <div className="mb-10">
          <p className="text-xl font-extrabold text-[#444444] my-6">내가 생성한 앨범</p>
          <AlbumList albums={albums} />
        </div>
      </div>
    </>
  );
};

export default MyAlbumPage;