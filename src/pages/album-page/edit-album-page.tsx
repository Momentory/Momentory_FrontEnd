import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import Modal from '../../components/common/Modal';
import TitleTemplate1 from '../../components/MyAlbum/Templetes/TitleTemplate1';
import TitleTemplate2 from '../../components/MyAlbum/Templetes/TitleTemplate2';
import TitleTemplate3 from '../../components/MyAlbum/Templetes/TitleTemplate3';
import TitleTemplate4 from '../../components/MyAlbum/Templetes/TitleTemplate4';
import pageTemplate1 from '../../assets/icons/pageTemplete1.svg';
import pageTemplate2 from '../../assets/icons/pageTemplete2.svg';
import pageTemplate3 from '../../assets/icons/pageTemplete3.svg';
import pageTemplate4 from '../../assets/icons/pageTemplete4.svg';
import type { TitleTemplateProps } from '../../types/Templates';

const titleTemplateMap: Record<number, React.FC<TitleTemplateProps>> = {
  1: TitleTemplate1,
  2: TitleTemplate2,
  3: TitleTemplate3,
  4: TitleTemplate4,
};

type PageData = {
  templateId: number;
  title: string;
  subTitle: string;
  image: string | null;
};

const EditAlbumPage = () => {
  const { id } = useParams();
  const initialTemplateId = Number(id) || 1;

  const [pages, setPages] = useState<PageData[]>([
    { templateId: initialTemplateId, title: '', subTitle: '', image: null },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const currentPage = pages[currentPageIndex];
  const Template = titleTemplateMap[currentPage.templateId];

  const updatePage = (index: number, changes: Partial<PageData>) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], ...changes };
    setPages(newPages);
  };

  const addPage = (templateId: number) => {
    setPages([...pages, { templateId, title: '', subTitle: '', image: null }]);
    setCurrentPageIndex(pages.length);
    setShowModal(false);
    setSelectedTemplate(null);
  };

  const templates = [
    { id: 1, image: pageTemplate1 },
    { id: 2, image: pageTemplate2 },
    { id: 3, image: pageTemplate3 },
    { id: 4, image: pageTemplate4 },
  ];

  return (
    <div>
      <DropdownHeader title="앨범 편집" />

      <div className="flex flex-col items-center">
        {Template && (
          <Template
            title={currentPage.title}
            setTitle={(newTitle) =>
              updatePage(currentPageIndex, { title: newTitle })
            }
            subTitle={currentPage.subTitle}
            setSubTitle={(newSub) =>
              updatePage(currentPageIndex, { subTitle: newSub })
            }
            image={currentPage.image}
            setImage={(newImg) =>
              updatePage(currentPageIndex, { image: newImg })
            }
          />
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPageIndex === 0}
          onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
        >
          이전 페이지
        </button>
        <button
          className="px-4 py-2 bg-[#FF7070] text-white rounded"
          onClick={() => setShowModal(true)}
        >
          새 페이지 추가
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPageIndex === pages.length - 1}
          onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
        >
          다음 페이지
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {pages.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === currentPageIndex ? 'bg-[#FF7070]' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {showModal && (
        <Modal title="템플릿 선택" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-4 px-4">
            {templates.map((template) => (
              <div key={template.id} className="relative">
                <button
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full overflow-hidden border ${
                    selectedTemplate === template.id
                      ? 'border-[#FF7070]'
                      : 'border-[#8B8B8B]'
                  }`}
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
          <button
            className={`mt-4 w-full rounded-3xl py-4 text-lg font-bold transition ${
              selectedTemplate
                ? 'bg-[#FF7070] text-white hover:bg-[#E56363]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedTemplate}
            onClick={() => selectedTemplate && addPage(selectedTemplate)}
          >
            선택
          </button>
        </Modal>
      )}
    </div>
  );
};

export default EditAlbumPage;