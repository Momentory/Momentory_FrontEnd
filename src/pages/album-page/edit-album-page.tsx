import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useMyPhotos } from '../../hooks/useMyPhotos';
import DropdownHeader from '../../components/common/DropdownHeader';
import Modal from '../../components/common/Modal';
import Popover from '../../components/common/Popover';
import MemoStickerModal from '../../components/MyAlbum/MemoStickerModal';
import TemplateEditModal from '../../components/MyAlbum/TemplateEditModal';
import UploadImageSelector from '../../components/MyAlbum/UploadImageList';
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
import { album } from '../../api/album';
import type { PageData, TemplateProps } from '../../types/Templates';
import type { AlbumImage } from '../../types/album';

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
  const { albumId, id } = useParams();
  const navigate = useNavigate();
  const initialTemplateId = id ? Number(id) : 1;
  const templateRef = useRef<HTMLDivElement>(null);

  const [pages, setPages] = useState<PageData[]>([createEmptyPageData(initialTemplateId)]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMemoStickerModal, setShowMemoStickerModal] = useState(false);
  const [showTemplateEditModal, setShowTemplateEditModal] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');

  const {
    data: photosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPhotos,
    isError: isPhotosError,
  } = useMyPhotos(20);

  const uploadedImages = useMemo(() => {
    if (!photosData?.pages) return [];
    return photosData.pages.flatMap(page => page.photos.map(photo => photo.imageUrl));
  }, [photosData]);

  const loadMorePhotos = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (albumId) {
      const fetchAlbumDetail = async () => {
        setIsLoading(true);
        try {
          const response = await album.getAlbumDetail(Number(albumId));

          if (response.isSuccess && response.result) {
            const { title } = response.result;
            setAlbumTitle(title);
          }
        } catch (err) {
          console.error('앨범 불러오기 실패:', err);
          alert('앨범을 불러오는데 실패했습니다.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAlbumDetail();
    }
  }, [albumId]);

  const currentPage = pages[currentPageIndex];
  const Template = templateMap[currentPage.templateId];

  const updatePageData = (index: number, changes: Partial<PageData>) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], ...changes };
    setPages(newPages);
  };

  const addPage = (templateId: number) => {
    const newPage = createEmptyPageData(templateId);
    setPages((prevPages) => [...prevPages, newPage]);
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

  const getMaxSelectionForCurrentTemplate = () => {
    const currentTemplateId = currentPage.templateId;
    if (currentTemplateId === 11) return 3;
    if (currentTemplateId === 13) return 2;
    return 1;
  };

  const handleImageFieldClick = (fieldName: string) => {
    setCurrentImageField(fieldName);
    setShowImageSelector(true);
  };

  const handleImageSelect = (images: string[]) => {
    if (!currentImageField) return;
    
    const currentTemplateId = currentPage.templateId;
    const isPageTemplate = currentTemplateId >= 11;
    
    if (isPageTemplate && currentTemplateId === 11) {
      const fields = ['image1', 'image2', 'image3'] as const;
      const startIndex = fields.indexOf(currentImageField as 'image1' | 'image2' | 'image3');
      if (startIndex !== -1) {
        const updates: Partial<PageData> = {};
        images.forEach((img, idx) => {
          if (startIndex + idx < fields.length) {
            const field = fields[startIndex + idx];
            (updates as any)[field] = img;
          }
        });
        updatePageData(currentPageIndex, updates);
      }
    } else if (isPageTemplate && currentTemplateId === 13) {
      const fields = ['image1', 'image2'] as const;
      const startIndex = fields.indexOf(currentImageField as 'image1' | 'image2');
      if (startIndex !== -1) {
        const updates: Partial<PageData> = {};
        images.forEach((img, idx) => {
          if (startIndex + idx < fields.length) {
            const field = fields[startIndex + idx];
            (updates as any)[field] = img;
          }
        });
        updatePageData(currentPageIndex, updates);
      }
    } else {
      updatePageData(currentPageIndex, { [currentImageField]: images[0] });
    }
    
    setShowImageSelector(false);
    setCurrentImageField('');
  };

  const capturePageAsImage = async (pageIndex: number): Promise<Blob> => {
    if (!templateRef.current) {
      throw new Error('템플릿을 찾을 수 없습니다.');
    }

    setCurrentPageIndex(pageIndex);

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(templateRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('이미지 변환에 실패했습니다.');
        }
      }, 'image/jpeg', 0.8);
    });
  };

  const handleSaveAlbum = async () => {
    const firstPageTitle = pages[0]?.title || albumTitle;
    if (!firstPageTitle.trim()) {
      alert('앨범 제목을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      // 모든 페이지를 이미지로 캡처
      const imageBlobs: { blob: Blob; name: string }[] = [];

      for (let i = 0; i < pages.length; i++) {
        const imageBlob = await capturePageAsImage(i);
        imageBlobs.push({
          blob: imageBlob,
          name: `page_${i + 1}`,
        });
      }

      // 이미지를 한 번에 업로드
      const uploadResponse = await album.uploadImages(imageBlobs);

      if (!uploadResponse.isSuccess || !uploadResponse.result) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      // 업로드된 이미지 정보 변환
      const albumImages: AlbumImage[] = uploadResponse.result.map((img, index) => ({
        imageName: img.imageName,
        imageUrl: img.imageUrl,
        index,
      }));

      if (albumId) {
        await album.updateAlbum(Number(albumId), {
          title: firstPageTitle,
          images: albumImages,
        });
        alert('앨범이 수정되었습니다.');
      } else {
        const response = await album.createAlbum({
          title: firstPageTitle,
          images: albumImages,
        });
        alert('앨범이 생성되었습니다.');
        navigate(`/album/${response.result.id}`);
      }
    } catch (err) {
      console.error('앨범 저장 실패:', err);
      alert('앨범 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const pageTemplatesForModal = [
    { id: 11, image: pageTemplate1Icon },
    { id: 12, image: pageTemplate2Icon },
    { id: 13, image: pageTemplate3Icon },
    { id: 14, image: pageTemplate4Icon },
  ];

  if (isLoading && albumId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">앨범을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div>
      <DropdownHeader 
        title={`${currentPageIndex + 1} / ${pages.length}`}
        rightItem={
          <div className="flex gap-2">
            <button
              className="font-bold text-[#5D9CCF] transition"
              onClick={() => setShowModal(true)}
            >
              추가
            </button>
            <button
              className="font-bold text-[#FF7070] transition"
              onClick={handleSaveAlbum}
              disabled={isLoading}
            >
              {isLoading ? '저장중...' : '저장'}
            </button>
          </div>
        }
      />
      <div className="flex flex-col items-center relative">
        <div ref={templateRef}>
          {Template && (
            <Template
              data={currentPage}
              updateData={(changes) => updatePageData(currentPageIndex, changes)}
              onEmptyAreaClick={handleEmptyAreaClick}
              onImageClick={handleImageFieldClick}
            />
          )}
        </div>
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
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPageIndex === pages.length - 1}
          onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
        >
          다음
        </button>
      </div>
      {showModal && (
        <Modal title="템플릿 선택" onClose={() => setShowModal(false)}>
          <div className="flex flex-col w-full h-full max-h-[60vh]">
            <div className="flex-1 overflow-y-auto -mx-4 px-4">
              <div className="grid grid-cols-2 gap-4 pb-4">
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
            </div>
            <div className="pt-4 -mx-4 px-4 border-t border-gray-200 mt-2">
              <button
                className={`w-full rounded-3xl py-4 text-lg font-bold transition ${
                  selectedTemplate
                    ? 'bg-[#FF7070] text-white hover:bg-[#E56363]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedTemplate}
                onClick={() => selectedTemplate && addPage(selectedTemplate)}
              >
                선택
              </button>
            </div>
          </div>
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
      {showImageSelector && (
        <Modal title="이미지 선택" onClose={() => setShowImageSelector(false)}>
          <UploadImageSelector
            images={uploadedImages}
            onSelect={handleImageSelect}
            maxSelection={getMaxSelectionForCurrentTemplate()}
            onLoadMore={loadMorePhotos}
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
            isError={isPhotosError}
          />
        </Modal>
      )}
    </div>
  );
};

export default EditAlbumPage;