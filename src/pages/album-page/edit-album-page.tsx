import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import Modal from '../../components/common/Modal';
import Popover from '../../components/common/Popover';
import MemoStickerModal from '../../components/MyAlbum/MemoStickerModal';
import TemplateEditModal from '../../components/MyAlbum/TemplateEditModal';
import TitleTemplate1 from '../../components/MyAlbum/Templetes/title/TitleTemplate1';
import TitleTemplate2 from '../../components/MyAlbum/Templetes/title/TitleTemplate2';
import TitleTemplate3 from '../../components/MyAlbum/Templetes/title/TitleTemplate3';
import TitleTemplate4 from '../../components/MyAlbum/Templetes/title/TitleTemplate4';
import PageTemplate1 from '../../components/MyAlbum/Templetes/page/PageTemplate1';
import PageTemplate2 from '../../components/MyAlbum/Templetes/page/PageTemplate2';
import PageTemplate3 from '../../components/MyAlbum/Templetes/page/PageTemplate3';
import PageTemplate4 from '../../components/MyAlbum/Templetes/page/PageTemplate4';
import pageTemplate1Icon from '../../assets/icons/pageTemplete1.svg';
import pageTemplate2Icon from '../../assets/icons/pageTemplete2.svg';
import pageTemplate3Icon from '../../assets/icons/pageTemplete3.svg';
import pageTemplate4Icon from '../../assets/icons/pageTemplete4.svg';
import type { PageData, TemplateProps } from '../../types/Templates';

const templateMap: Record<number, React.FC<TemplateProps>> = {
  1: TitleTemplate1,
  2: TitleTemplate2,
  3: TitleTemplate3,
  4: TitleTemplate4,
  11: PageTemplate1,
  12: PageTemplate2,
  13: PageTemplate3,
  14: PageTemplate4,
};

const createEmptyPageData = (templateId: number): PageData => ({
  templateId,
  title: '',
  subTitle: '',
  image: null,
  image1: null,
  image2: null,
  image3: null,
  bodyText: '',
  bodyText1: '',
  bodyText2: '',
  subTitle2: '',
});

const EditAlbumPage = () => {
  const { id } = useParams();
  const initialTemplateId = Number(id) || 1;

  const [pages, setPages] = useState<PageData[]>([createEmptyPageData(initialTemplateId)]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMemoStickerModal, setShowMemoStickerModal] = useState(false);
  const [showTemplateEditModal, setShowTemplateEditModal] = useState(false);

  const currentPage = pages[currentPageIndex];
  const Template = templateMap[currentPage.templateId];

  const updatePageData = (index: number, changes: Partial<PageData>) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], ...changes };
    setPages(newPages);
  };

  const addPage = (templateId: number) => {
    setPages([...pages, createEmptyPageData(templateId)]);
    setCurrentPageIndex(pages.length);
    setShowModal(false);
    setSelectedTemplate(null);
  };

  const handleEmptyAreaClick = (position: { x: number; y: number }) => {
    setPopoverPosition(position);
  };

  const handlePopoverSelect = (option: 'memo' | 'template') => {
    if (option === 'memo') {
      setShowMemoStickerModal(true);
    } else if (option === 'template') {
      setShowTemplateEditModal(true);
    }
    setPopoverPosition(null);
  };

  const handleTemplateChange = (newTemplateId: number) => {
    const newPages = [...pages];
    newPages[currentPageIndex] = { ...newPages[currentPageIndex], templateId: newTemplateId };
    setPages(newPages);
  };

  const pageTemplatesForModal = [
    { id: 11, image: pageTemplate1Icon },
    { id: 12, image: pageTemplate2Icon },
    { id: 13, image: pageTemplate3Icon },
    { id: 14, image: pageTemplate4Icon },
  ];

  return (
    <div>
      <DropdownHeader title="앨범 편집" />
      <div className="flex flex-col items-center relative">
        {Template && (
          <Template
            data={currentPage}
            updateData={(changes) => updatePageData(currentPageIndex, changes)}
            onEmptyAreaClick={handleEmptyAreaClick}
          />
        )}
        {popoverPosition && (
          <Popover
            position={popoverPosition}
            onClose={() => setPopoverPosition(null)}
            onSelect={handlePopoverSelect}
          />
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPageIndex === 0}
          onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
        >
          이전
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
          다음
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {pages.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              idx === currentPageIndex ? 'bg-[#FF7070]' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentPageIndex(idx)}
          />
        ))}
      </div>
      {showModal && (
        <Modal title="템플릿 선택" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-4 px-4">
            {pageTemplatesForModal.map((template) => (
              <div key={template.id} className="relative">
                <button
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full overflow-hidden border ${
                    selectedTemplate === template.id ? 'border-2 border-[#FF7070]' : 'border-[#4F4F4F]'
                  }`}
                >
                  <img src={template.image} alt={`Template ${template.id}`} className="w-full object-cover" />
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
      <MemoStickerModal
        isOpen={showMemoStickerModal}
        onClose={() => setShowMemoStickerModal(false)}
      />
      <TemplateEditModal
        isOpen={showTemplateEditModal}
        onClose={() => setShowTemplateEditModal(false)}
        currentTemplateId={currentPage.templateId}
        onSelectTemplate={handleTemplateChange}
      />
    </div>
  );
};

export default EditAlbumPage;