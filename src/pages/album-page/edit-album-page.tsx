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
import AlbumEditBottomSheet from '../../components/MyAlbum/AlbumEditBottomSheet';
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
import { toS3WebsiteUrl } from '../../utils/s3';
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

const pageTemplatesForModal = [
  { id: 11, image: pageTemplate1Icon },
  { id: 12, image: pageTemplate2Icon },
  { id: 13, image: pageTemplate3Icon },
  { id: 14, image: pageTemplate4Icon },
];

const EditAlbumPage = () => {
  const { albumId, id } = useParams();
  const navigate = useNavigate();
  const initialTemplateId = id ? Number(id) : 1;
  const templateRef = useRef<HTMLDivElement>(null);

  // albumId가 있으면 (수정 모드) 빈 배열로 시작, 없으면 (생성 모드) 빈 페이지로 시작
  const [pages, setPages] = useState<PageData[]>(
    albumId ? [] : [createEmptyPageData(initialTemplateId)]
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMemoStickerModal, setShowMemoStickerModal] = useState(false);
  const [showTemplateEditModal, setShowTemplateEditModal] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string>('');
  const [isLoading, setIsLoading] = useState(!!albumId); // albumId가 있으면 초기 로딩 상태
  const [albumTitle, setAlbumTitle] = useState('');

  // 앨범 수정 모드용 상태
  const [bottomSheetHeight, setBottomSheetHeight] = useState(60);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const {
    data: photosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPhotos,
    isError: isPhotosError,
  } = useMyPhotos(20);

  const uploadedImages = useMemo(() => {
    if (!photosData?.pages) {
      return [];
    }

    const images = photosData.pages.flatMap(page => {
      return page.photos.map(photo => {
        // S3 REST Endpoint를 Website Endpoint로 변환 (CORS 해결)
        return toS3WebsiteUrl(photo.imageUrl);
      });
    });

    console.log('✅ [EditAlbumPage] 최종 uploadedImages (Website Endpoint 적용):', images);
    return images;
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
            const { title, images } = response.result;
            setAlbumTitle(title);

            // 기존 이미지들을 readOnly 페이지로 변환
            const existingPages: PageData[] = images
              .sort((a, b) => a.index - b.index)
              .map((img) => ({
                templateId: 0,
                readOnly: true,
                // S3 REST Endpoint를 Website Endpoint로 변환 (CORS 해결)
                imageUrl: toS3WebsiteUrl(img.imageUrl),
              }));

            setPages(existingPages);
            setCurrentPageIndex(0);
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
  const Template = currentPage ? templateMap[currentPage.templateId] : null;

  const updatePageData = (index: number, changes: Partial<PageData>) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], ...changes };
    setPages(newPages);
  };

  const captureThumbnail = async (pageIndex: number): Promise<string> => {
    try {
      const pageData = pages[pageIndex];
      const TemplateComponent = templateMap[pageData.templateId];

      if (!TemplateComponent) {
        return '';
      }

      // 임시 div 생성
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      // React 컴포넌트를 임시 div에 렌더링
      const root = (await import('react-dom/client')).createRoot(tempDiv);

      await new Promise<void>((resolve) => {
        root.render(
          <TemplateComponent
            data={pageData}
            updateData={() => {}}
            onEmptyAreaClick={() => {}}
            onImageClick={() => {}}
          />
        );
        setTimeout(resolve, 200);
      });

      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true,
        allowTaint: true,
      });

      const dataUrl = canvas.toDataURL('image/jpeg', 0.6);

      // 정리
      root.unmount();
      document.body.removeChild(tempDiv);

      return dataUrl;
    } catch (error) {
      console.error('썸네일 캡처 실패:', error);
      return '';
    }
  };

  const addPage = async (templateId: number) => {
    const newPage = createEmptyPageData(templateId);
    const targetIndex = insertIndex !== null ? insertIndex : pages.length;

    const updatedPages = [...pages];
    updatedPages.splice(targetIndex, 0, newPage);

    setPages(updatedPages);
    setCurrentPageIndex(targetIndex);
    setShowModal(false);
    setSelectedTemplate(null);
    setInsertIndex(null);

    // 썸네일 캡처 (비동기)
    setTimeout(async () => {
      const thumbnail = await captureThumbnail(targetIndex);
      if (thumbnail) {
        setPages(prevPages => {
          const newPages = [...prevPages];
          if (newPages[targetIndex]) {
            newPages[targetIndex] = { ...newPages[targetIndex], thumbnail };
          }
          return newPages;
        });
      }
    }, 300);
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
    const pageData = pages[pageIndex];
    const TemplateComponent = templateMap[pageData.templateId];

    if (!TemplateComponent) {
      throw new Error(`템플릿 ID ${pageData.templateId}를 찾을 수 없습니다.`);
    }

    // 임시 div 생성
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    document.body.appendChild(tempDiv);

    // React 컴포넌트를 임시 div에 렌더링
    const root = (await import('react-dom/client')).createRoot(tempDiv);

    await new Promise<void>((resolve) => {
      root.render(
        <TemplateComponent
          data={pageData}
          updateData={() => {}}
          onEmptyAreaClick={() => {}}
          onImageClick={() => {}}
        />
      );
      // 렌더링 완료 대기
      setTimeout(resolve, 500);
    });

    try {
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('이미지 변환에 실패했습니다.'));
          }
        }, 'image/jpeg', 0.8);
      });

      return blob;
    } finally {
      // 정리
      root.unmount();
      document.body.removeChild(tempDiv);
    }
  };

  const handleSaveAlbum = async () => {
    // 앨범 수정/생성 모드
    const firstPageTitle = pages[0]?.title || albumTitle;
    if (!firstPageTitle.trim()) {
      alert('앨범 제목을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      // readOnly가 아닌 새 페이지만 캡처
      const imageBlobs: { blob: Blob; name: string; index: number }[] = [];

      for (let i = 0; i < pages.length; i++) {
        if (!pages[i].readOnly) {
          const imageBlob = await capturePageAsImage(i);
          imageBlobs.push({
            blob: imageBlob,
            name: `page_${i + 1}`,
            index: i,
          });
        }
      }

      // 새로운 이미지만 업로드
      let uploadedImages: { imageName: string; imageUrl: string }[] = [];
      if (imageBlobs.length > 0) {
        const uploadResponse = await album.uploadImages(imageBlobs.map(item => ({
          blob: item.blob,
          name: item.name,
        })));

        if (!uploadResponse.isSuccess || !uploadResponse.result) {
          throw new Error('이미지 업로드에 실패했습니다.');
        }

        uploadedImages = uploadResponse.result;
      }

      // 기존 이미지와 새 이미지를 순서대로 합침
      const albumImages: AlbumImage[] = [];
      let newImageIndex = 0;

      for (let i = 0; i < pages.length; i++) {
        if (pages[i].readOnly && pages[i].imageUrl) {
          // 기존 페이지
          const imageUrl = pages[i].imageUrl!;
          const imageName = imageUrl.split('/').pop() || `existing_${i}`;

          albumImages.push({
            imageName,
            imageUrl,
            index: i,
          });
        } else {
          // 새 페이지
          if (newImageIndex < uploadedImages.length) {
            albumImages.push({
              imageName: uploadedImages[newImageIndex].imageName,
              imageUrl: uploadedImages[newImageIndex].imageUrl,
              index: i,
            });
            newImageIndex++;
          }
        }
      }

      // 앨범 수정 또는 생성
      if (albumId) {
        await album.updateAlbum(Number(albumId), {
          title: firstPageTitle,
          images: albumImages,
        });
        alert('앨범이 수정되었습니다.');
        navigate(`/album/${albumId}`);
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

  const handleReorderPages = (newPages: PageData[]) => {
    setPages(newPages);
  };

  const handleAddClick = (index: number) => {
    setInsertIndex(index);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">앨범을 불러오는 중...</p>
      </div>
    );
  }

  // 앨범 수정 모드: 이미지가 없는 경우
  if (albumId && pages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-gray-600">앨범에 페이지가 없습니다.</p>
      </div>
    );
  }

  // 앨범 생성 모드: 페이지가 없는 경우
  if (!albumId && !currentPage) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-gray-600">페이지가 없습니다. 새 페이지를 추가해주세요.</p>
        <button
          className="rounded-3xl bg-[#FF7070] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#E56363] cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          첫 페이지 추가
        </button>
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
      </div>
    );
  }

  // 앨범 수정 모드 UI
  if (albumId) {
    return (
      <div className="relative h-screen overflow-hidden">
        <DropdownHeader
          title="앨범 수정"
          rightItem={
            <button
              className="font-bold text-[#FF7070] transition"
              onClick={handleSaveAlbum}
              disabled={isLoading}
            >
              {isLoading ? '저장중...' : '완료'}
            </button>
          }
        />

        <div
          className="flex items-center justify-center bg-gray-50 p-4"
          style={{
            height: `calc(100vh - ${bottomSheetHeight}px)`,
          }}
        >
          {pages.length > 0 && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div ref={templateRef} className="max-w-full max-h-full flex items-center justify-center">
                {currentPage && (
                  currentPage.readOnly ? (
                    <img
                      src={currentPage.imageUrl}
                      alt={`Page ${currentPageIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  ) : (
                    Template && (
                      <Template
                        data={currentPage}
                        updateData={(changes) => updatePageData(currentPageIndex, changes)}
                        onEmptyAreaClick={handleEmptyAreaClick}
                        onImageClick={handleImageFieldClick}
                      />
                    )
                  )
                )}
              </div>
              {currentPage && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {currentPageIndex + 1} / {pages.length}
                </div>
              )}
            </div>
          )}
        </div>

        <AlbumEditBottomSheet
          height={bottomSheetHeight}
          setHeight={setBottomSheetHeight}
          isExpanded={isBottomSheetExpanded}
          setIsExpanded={setIsBottomSheetExpanded}
          pages={pages}
          onReorder={handleReorderPages}
          onImageClick={setCurrentPageIndex}
          currentPageIndex={currentPageIndex}
          onAddClick={handleAddClick}
        />

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

        {!currentPage?.readOnly && popoverPosition && (
          <Popover
            position={popoverPosition}
            onClose={() => setPopoverPosition(null)}
            onSelect={handlePopoverSelect}
          />
        )}

        <MemoStickerModal
          isOpen={showMemoStickerModal}
          onClose={() => setShowMemoStickerModal(false)}
        />
        <TemplateEditModal
          isOpen={showTemplateEditModal}
          onClose={() => setShowTemplateEditModal(false)}
          currentTemplateId={currentPage?.templateId || 11}
          onSelectTemplate={handleTemplateChange}
        />
        {showImageSelector && (
          <Modal title="이미지 선택" onClose={() => setShowImageSelector(false)}>
            {(() => {
              return null;
            })()}
            <UploadImageSelector
              images={uploadedImages}
              onSelect={handleImageSelect}
              maxSelection={getMaxSelectionForCurrentTemplate()}
              onLoadMore={loadMorePhotos}
              hasMore={hasNextPage}
              isLoading={isLoadingPhotos || isFetchingNextPage}
              isError={isPhotosError}
            />
          </Modal>
        )}
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
          {currentPage.readOnly ? (
            // 기존 앨범 페이지는 이미지로만 표시 (수정 불가)
            <div className="relative w-full max-w-sm">
              <img
                src={currentPage.imageUrl}
                alt={`Page ${currentPageIndex + 1}`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                기존 페이지 (수정 불가)
              </div>
            </div>
          ) : (
            // 새로운 페이지는 템플릿으로 편집 가능
            Template && (
              <Template
                data={currentPage}
                updateData={(changes) => updatePageData(currentPageIndex, changes)}
                onEmptyAreaClick={handleEmptyAreaClick}
                onImageClick={handleImageFieldClick}
              />
            )
          )}
        </div>
        {!currentPage.readOnly && popoverPosition && (
          <Popover
            position={popoverPosition}
            onClose={() => setPopoverPosition(null)}
            onSelect={handlePopoverSelect}
          />
        )}
      </div>

      <div className="flex flex-col items-center gap-4 mt-6">
        <div className="flex justify-center gap-4">
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

        {/* 순서 변경 버튼 */}
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={currentPageIndex === 0}
            onClick={() => {
              const newPages = [...pages];
              [newPages[currentPageIndex], newPages[currentPageIndex - 1]] =
                [newPages[currentPageIndex - 1], newPages[currentPageIndex]];
              setPages(newPages);
              setCurrentPageIndex(currentPageIndex - 1);
            }}
          >
            ↑ 위로 이동
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={currentPageIndex === pages.length - 1}
            onClick={() => {
              const newPages = [...pages];
              [newPages[currentPageIndex], newPages[currentPageIndex + 1]] =
                [newPages[currentPageIndex + 1], newPages[currentPageIndex]];
              setPages(newPages);
              setCurrentPageIndex(currentPageIndex + 1);
            }}
          >
            ↓ 아래로 이동
          </button>
        </div>
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
            isLoading={isLoadingPhotos || isFetchingNextPage}
            isError={isPhotosError}
          />
        </Modal>
      )}
    </div>
  );
};

export default EditAlbumPage;