export interface TitleTemplateProps {
  title: string;
  setTitle: (v: string) => void;
  subTitle?: string;
  setSubTitle?: (v: string) => void;
  image?: string | null;
  setImage?: (v: string | null) => void;
}