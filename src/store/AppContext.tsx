import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order, Address } from '@/types';
import { storage } from '@/utils/storage';
import Taro from '@tarojs/taro';

interface AppContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (productId: number, name: string, image: string, spec: string, price: number) => void;
  updateCartItemQuantity: (itemId: number, delta: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  createOrder: (address: Address) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setCart(storage.getCart());
    setOrders(storage.getOrders());
  }, []);

  const addToCart = (productId: number, name: string, image: string, spec: string, price: number) => {
    const existingItem = cart.find(item => item.productId === productId && item.spec === spec);
    
    let newCart;
    if (existingItem) {
      newCart = cart.map(item => 
        item.productId === productId && item.spec === spec
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, {
        id: Date.now(),
        productId,
        name,
        image,
        spec,
        price,
        quantity: 1
      }];
    }
    
    setCart(newCart);
    storage.setCart(newCart);
    Taro.showToast({ title: '已加入购物车', icon: 'success' });
  };

  const updateCartItemQuantity = (itemId: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setCart(newCart);
    storage.setCart(newCart);
  };

  const removeFromCart = (itemId: number) => {
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    storage.setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    storage.setCart([]);
  };

  const createOrder = (address: Address) => {
    const total = getCartTotal();
    const order: Order = {
      id: Date.now(),
      items: [...cart],
      address,
      total,
      time: new Date().toLocaleString('zh-CN'),
      status: '待发货'
    };

    const newOrders = [order, ...orders];
    setOrders(newOrders);
    storage.setOrders(newOrders);
    clearCart();
    Taro.showToast({ title: '下单成功', icon: 'success' });
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <AppContext.Provider value={{
      cart,
      orders,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      clearCart,
      createOrder,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
