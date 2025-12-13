export interface CarouselResponseType {
  _id: string;
  title: string;
  slug: string; 
  collection_type: "project" | "perspective";
  banner?: string;
  isCarousel?: boolean;
  orderCarousel?: number;
  extraURL?: string;
}
