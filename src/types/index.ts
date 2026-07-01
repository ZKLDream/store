export interface Fruit {
  _id?: string;
  id: number;
  category: string;
  name: string;
  desc: string;
  price: number;
  costPrice: number;
  image: string;
  video?: string;
}

export interface ListItem {
  id: number;
  _id?: string;
  productId: number;
  name: string;
  image: string;
  spec: string;
  price: number;
  costPrice: number;
  quantity: number;
}

export interface SalesRecord {
  _id?: string;
  id: number;
  items: ListItem[];
  totalSales: number;
  totalProfit: number;
  date: string;
}

export interface VideoEpisode {
  index: number;
  title: string;
  author: string;
  duration: string;
  videoUrl: string;
  downloadUrl: string;
}

export interface VideoCollection {
  id: string;
  title: string;
  author: string;
  sourceUrl: string;
  episodeCount: number;
  episodes: VideoEpisode[];
  createdAt: number;
}
