import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ListItem, SalesRecord } from '@/types';
import { storage } from '@/utils/storage';
import { getBeforeList, deleteBeforeListRecord } from '@/utils/cloud';
import Taro from '@tarojs/taro';

interface AppContextType {
  list: ListItem[];
  salesRecords: SalesRecord[];
  userAvatar: string;
  userName: string;
  salesRecordsLoading: boolean;
  listLoading: boolean;
  addToList: (productId: number, fruitId: string | undefined, name: string, image: string, spec: string, price: number, costPrice: number, quantity: number) => void;
  updateListItemQuantity: (itemId: number, delta: number) => void;
  updateListItemPrice: (itemId: number, price: number) => void;
  updateListItemCostPrice: (itemId: number, costPrice: number) => void;
  removeFromList: (itemId: number) => void;
  clearList: () => void;
  uploadListToCloud: () => Promise<void>;
  createSalesRecord: () => Promise<void>;
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
  const [salesRecordsLoading, setSalesRecordsLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [cloudInitialized, setCloudInitialized] = useState(false);

  useEffect(() => {
    const initCloud = async () => {
      try {
        if (Taro.cloud) {
          Taro.cloud.init({
            env: 'cloudbase-7gtch60w7e16d4ef',
            traceUser: true,
          });
          console.log('云开发初始化成功');
        }
      } catch (e) {
        console.error('云开发初始化失败:', e);
      } finally {
        setCloudInitialized(true);
      }
    };

    initCloud();
  }, []);

  useEffect(() => {
    if (cloudInitialized) {
      loadList();
      loadSalesRecords();
      const profile = storage.getUserProfile();
      setUserAvatar(profile.avatar);
      setUserName(profile.name);
    }
  }, [cloudInitialized]);

  const loadList = async () => {
    try {
      setListLoading(true);
      const data = await storage.getList();
      setList(data);
    } catch (e) {
      console.error('[AppContext] loadList error', e);
    } finally {
      setListLoading(false);
    }
  };

  const loadSalesRecords = async () => {
    try {
      setSalesRecordsLoading(true);
      const records = await storage.getSalesRecords();
      setSalesRecords(records);
    } catch (e) {
      console.error('[AppContext] loadSalesRecords error', e);
    } finally {
      setSalesRecordsLoading(false);
    }
  };

  const addToList = (productId: number, fruitId: string | undefined, name: string, image: string, spec: string, unitPrice: number, unitCostPrice: number, quantity: number) => {
    let existingItem;
    if (fruitId) {
      existingItem = list.find(item => item._id === fruitId);
    }
    
    let newList;
    if (existingItem) {
      newList = list.map(item => 
        item._id === fruitId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newList = [...list, {
        id: Date.now(),
        _id: fruitId,
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

  const uploadListToCloud = async () => {
    try {
      const result = await storage.uploadListToCloud(list);
      if (result.success) {
        Taro.showToast({ title: '上传成功', icon: 'success' });
      } else {
        Taro.showToast({ title: '上传失败', icon: 'error' });
      }
    } catch (e) {
      console.error('[AppContext] uploadListToCloud error', e);
      Taro.showToast({ title: '上传失败', icon: 'error' });
    }
  };

  const createSalesRecord = async () => {
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
    await storage.setSalesRecords(newSalesRecords);

    try {
      const cloudRecords = await getBeforeList();
      if (cloudRecords && cloudRecords.length > 0) {
        const recordId = cloudRecords[0]._id;
        if (recordId) {
          await deleteBeforeListRecord(recordId);
        }
      }
    } catch (e) {
      console.error('[AppContext] 删除云端清单记录失败', e);
    }

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
      salesRecordsLoading,
      listLoading,
      addToList,
      updateListItemQuantity,
      updateListItemPrice,
      updateListItemCostPrice,
      removeFromList,
      clearList,
      uploadListToCloud,
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
