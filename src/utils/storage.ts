import Taro from '@tarojs/taro';

const CART_KEY = 'fruitCart';
const ORDERS_KEY = 'fruitOrders';

export const storage = {
  getCart: () => {
    try {
      const data = Taro.getStorageSync(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getCart error', e);
      return [];
    }
  },

  setCart: (cart: any[]) => {
    try {
      Taro.setStorageSync(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('[Storage] setCart error', e);
    }
  },

  getOrders: () => {
    try {
      const data = Taro.getStorageSync(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getOrders error', e);
      return [];
    }
  },

  setOrders: (orders: any[]) => {
    try {
      Taro.setStorageSync(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('[Storage] setOrders error', e);
    }
  }
};
