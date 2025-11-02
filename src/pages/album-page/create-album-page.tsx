import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import titleTemplate1 from '../../assets/icons/titleTemplete1.svg';
import titleTemplate2 from '../../assets/icons/titleTemplete2.svg';
import titleTemplate3 from '../../assets/icons/titleTemplete3.svg';
import titleTemplate4 from '../../assets/icons/titleTemplete4.svg';
import CheckIcon from '../../assets/icons/checkIcon.svg?react';

const CreateAlbumPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const templates = [
    { id: 1, image: titleTemplate1 },
    { id: 2, image: titleTemplate2 },
    { id: 3, image: titleTemplate3 },
    { id: 4, image: titleTemplate4 },
  ];

  const handleSelect = (id: number) => {
    setSelectedTemplate(id);
  };

  const handleNext = () => {
    if (selectedTemplate) {
      navigate(`/edit/${selectedTemplate}`);
    } else {
      alert('템플릿을 선택해주세요!');
    }
  };

  return (
    <>
      <DropdownHeader title="새로 만들기" />
      <div className="p-8 pb-32">
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="relative">
              <div
                className={`absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center
                  ${selectedTemplate === template.id ? 'border-[#FF7070] bg-[#FF7070]' : 'border-[#8B8B8B] bg-white'}
                `}
              >
                {selectedTemplate === template.id && (
                  <CheckIcon className="w-8 h-8" />
                )}
              </div>

              <button
                onClick={() => handleSelect(template.id)}
                className={`w-full rounded-[15px] transition overflow-hidden
                  ${selectedTemplate === template.id ? 'border border-[#FF7070]' : 'border border-[#8B8B8B]'}
                `}
              >
                <img
                  src={template.image}
                  alt={`Template ${template.id}`}
                  className="w-full object-cover"
                />
              </button>
            </div>
          ))}
        </div>

        <div className="bottom-0 flex flex-col gap-4 mt-6 z-10 pb-4.5">
          <button
            className="w-full rounded-3xl bg-[#FF7070] py-4 text-lg font-bold text-white transition hover:bg-[#E56363] cursor-pointer"
            onClick={handleNext}
          >
            다음
          </button>
          <button
            className={`w-full rounded-3xl py-4 text-lg font-bold transition cursor-pointer bg-[#EAEAEA] text-[#8D8D8D]`}
            onClick={()=>navigate(-1)}
          >
            취소
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateAlbumPage;
