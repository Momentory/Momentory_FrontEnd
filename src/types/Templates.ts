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
};

export interface TemplateProps {
  data: PageData;
  updateData: (changes: Partial<PageData>) => void;
}