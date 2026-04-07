import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ListItem, SalesRecord } from '@/types';
import { storage } from '@/utils/storage';
import Taro from '@tarojs/taro';

interface AppContextType {
  list: ListItem[];
  salesRecords: SalesRecord[];
  userAvatar: string;
  userName: string;
  addToList: (productId: number, name: string, image: string, spec: string, price: number, costPrice: number, quantity: number) => void;
  updateListItemQuantity: (itemId: number, delta: number) => void;
  updateListItemPrice: (itemId: number, price: number) => void;
  updateListItemCostPrice: (itemId: number, costPrice: number) => void;
  removeFromList: (itemId: number) => void;
  clearList: () => void;
  createSalesRecord: () => void;
  getListTotal: () => number;
  getListProfit: () => number;
  getListCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [list, setList] = useState<ListItem[]>([]);
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    setList(storage.getList());
    setSalesRecords(storage.getSalesRecords());
    const profile = storage.getUserProfile();
    setUserAvatar(profile.avatar);
    setUserName(profile.name);
  }, []);

  const addToList = (productId: number, name: string, image: string, spec: string, unitPrice: number, unitCostPrice: number, quantity: number) => {
    const existingItem = list.find(item => item.productId === productId && item.spec === spec);
    
    let newList;
    if (existingItem) {
      newList = list.map(item => 
        item.productId === productId && item.spec === spec
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newList = [...list, {
        id: Date.now(),
        productId,
        name,
        image,
        spec,
        price: unitPrice,
        costPrice: unitCostPrice,
        quantity
      }];
    }
    
    setList(newList);
    storage.setList(newList);
    Taro.showToast({ title: '已加入清单', icon: 'success' });
  };

  const updateListItemQuantity = (itemId: number, delta: number) => {
    const newList = list.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setList(newList);
    storage.setList(newList);
  };

  const updateListItemPrice = (itemId: number, price: number) => {
    const newList = list.map(item => {
      if (item.id === itemId) {
        return { ...item, price };
      }
      return item;
    });
    
    setList(newList);
    storage.setList(newList);
  };

  const updateListItemCostPrice = (itemId: number, costPrice: number) => {
    const newList = list.map(item => {
      if (item.id === itemId) {
        return { ...item, costPrice };
      }
      return item;
    });
    
    setList(newList);
    storage.setList(newList);
  };

  const removeFromList = (itemId: number) => {
    const newList = list.filter(item => item.id !== itemId);
    setList(newList);
    storage.setList(newList);
  };

  const clearList = () => {
    setList([]);
    storage.setList([]);
  };

  const createSalesRecord = () => {
    const totalSales = getListTotal();
    const totalProfit = getListProfit();
    const salesRecord: SalesRecord = {
      id: Date.now(),
      items: [...list],
      totalSales,
      totalProfit,
      date: new Date().toLocaleString('zh-CN')
    };

    const newSalesRecords = [salesRecord, ...salesRecords];
    setSalesRecords(newSalesRecords);
    storage.setSalesRecords(newSalesRecords);
    clearList();
    Taro.showToast({ title: '结算成功', icon: 'success' });
  };

  const getListTotal = () => {
    return list.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getListProfit = () => {
    return list.reduce((sum, item) => sum + (item.price - item.costPrice) * item.quantity, 0);
  };

  const getListCount = () => {
    return list.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <AppContext.Provider value={{
      list,
      salesRecords,
      userAvatar,
      userName,
      addToList,
      updateListItemQuantity,
      updateListItemPrice,
      updateListItemCostPrice,
      removeFromList,
      clearList,
      createSalesRecord,
      getListTotal,
      getListProfit,
      getListCount
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
