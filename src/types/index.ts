export interface Fruit {
  _id?: string;
  id: number;
  category: string;
  name: string;
  desc: string;
  price: number;
  costPrice: number;
  image: string;
}

export interface ListItem {
  id: number;
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
