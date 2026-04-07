import Taro from '@tarojs/taro';
import { Fruit, SalesRecord } from '@/types';

export const getFruitsData = async (): Promise<Fruit[]> => {
  try {
    const res = await Taro.cloud.callFunction({
      name: 'fruitFunctions',
      data: {
        type: 'selectRecord'
      }
    });

    if (res.result) {
      return res.result.data || res.result || [];
    }
    return [];
  } catch (error) {
    console.error('获取水果数据失败:', error);
    throw error;
  }
};

export interface UserInfo {
  openid: string;
  appid: string;
  unionid?: string;
}

export const getUserOpenId = async (): Promise<UserInfo> => {
  try {
    const res = await Taro.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      }
    });

    if (res.result) {
      return res.result;
    }
    throw new Error('获取用户信息失败');
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

export const createCollection = async (): Promise<{ success: boolean; collectionName?: string; data?: string }> => {
  try {
    const res = await Taro.cloud.callFunction({
      name: 'fruitSaveFunctions',
      data: {
        type: 'createCollection'
      }
    });

    if (res.result) {
      return res.result;
    }
    return { success: false };
  } catch (error) {
    console.error('创建集合失败:', error);
    return { success: false };
  }
};

export const insertSalesRecord = async (record: SalesRecord): Promise<{ success: boolean; data?: any; collectionName?: string; errMsg?: any }> => {
  try {
    const now = new Date();
    const formattedRecord = {
      ...record,
      date: now.toISOString().split('T')[0]
    };

    const res = await Taro.cloud.callFunction({
      name: 'fruitSaveFunctions',
      data: {
        type: 'insertRecord',
        data: formattedRecord
      }
    });

    if (res.result) {
      return res.result;
    }
    return { success: false };
  } catch (error) {
    console.error('插入销售记录失败:', error);
    return { success: false, errMsg: error };
  }
};

export const getSalesRecordsFromCloud = async (): Promise<SalesRecord[]> => {
  try {
    const res = await Taro.cloud.callFunction({
      name: 'fruitSaveFunctions',
      data: {
        type: 'selectRecord'
      }
    });

    if (res.result) {
      return res.result.data || res.result || [];
    }
    return [];
  } catch (error) {
    console.error('获取销售记录失败:', error);
    throw error;
  }
};
