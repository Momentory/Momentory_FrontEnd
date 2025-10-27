import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';

const CreateAlbumPage = () => {
  const navigate = useNavigate();

  const templates = [1, 2, 3, 4];

  const handleSelect = (id: number) => {
    navigate(`/edit/${id}`); 
  };

  return (
    <>
      <DropdownHeader title="나의 사진첩" />
      <div className="grid grid-cols-2 gap-4 mb-10">
        {templates.map((id) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className="border rounded-xl shadow-sm hover:border-[#FF7070] hover:shadow-md transition p-4"
          >
            <p className="text-center font-semibold text-[#444]">
              Template {id}
            </p>
          </button>
        ))}
      </div>

      <button className="w-full bg-[#FF7070] text-white rounded-xl py-3 font-bold">
        다음
      </button>
    </>
  );
};

export default CreateAlbumPage;
