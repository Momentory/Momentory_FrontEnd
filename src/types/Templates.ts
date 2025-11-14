export type PageData = {
  templateId: number;
  title?: string;
  subTitle?: string;
  image?: string | null;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  bodyText?: string;
  bodyText1?: string;
  bodyText2?: string;
  subTitle2?: string;
  readOnly?: boolean; // 기존 앨범 페이지 여부
  imageUrl?: string; // 기존 앨범 페이지의 이미지 URL 또는 썸네일
  thumbnail?: string; // 새 페이지의 미리보기 썸네일 (base64)
};

export interface TemplateProps {
  data: PageData;
  updateData: (changes: Partial<PageData>) => void;
  onEmptyAreaClick?: (position: { x: number; y: number }) => void;
  onImageClick?: (fieldName: string) => void;
}