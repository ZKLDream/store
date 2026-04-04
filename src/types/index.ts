export interface Fruit {
  id: number;
  category: string;
  name: string;
  desc: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  spec: string;
  price: number;
  quantity: number;
}

export interface Address {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: number;
  items: CartItem[];
  address: Address;
  total: number;
  time: string;
  status: string;
}
