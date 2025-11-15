import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      img: "/images/sprout.png",
      label: "성장현황",
      link: "/character",
    },
    {
      img: "/images/location-pin.png",
      label: "나의지도",
      link: "/mymap"
    },
    {
      img: "/images/roulette.png",
      label: "여행지 추천",
      link: "/roulette",
    },
    {
      img: "/images/star.png",
      label: "스탬프",
      link: "/stamp-collection"
    },
  ];

  return (
    <section className="px-6 mt-10">
      <div
        className="rounded-[20px] px-5 py-4 shadow-md text-white"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,112,112,0.95), rgba(255,150,150,0.9))",
        }}
      >
        <h2 className="text-2xl font-bold mb-3">카테고리</h2>
        <div className="flex justify-around">
          {categories.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition"
              onClick={() => navigate(item.link)}
            >
              <div className="w-[58px] h-[58px] bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-[28px] h-auto"
                />
              </div>
              <p className="text-[13px] text-white font-semibold">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
