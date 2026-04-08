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

export const updateFruit = async (fruits: Fruit[]): Promise<{ success: boolean; data?: any; errMsg?: any }> => {
  try {
    const res = await Taro.cloud.callFunction({
      name: 'fruitFunctions',
      data: {
        type: 'updateRecord',
        data: fruits
      }
    });

    if (res.result) {
      return res.result;
    }
    return { success: false };
  } catch (error) {
    console.error('更新水果数据失败:', error);
    return { success: false, errMsg: error };
  }
};

export const deleteFruit = async (fruitId: string): Promise<{ success: boolean; data?: any; errMsg?: any }> => {
  try {
    const res = await Taro.cloud.callFunction({
      name: 'fruitFunctions',
      data: {
        type: 'deleteRecord',
        data: { _id: fruitId }
      }
    });

    if (res.result) {
      return res.result;
    }
    return { success: false };
  } catch (error) {
    console.error('删除水果数据失败:', error);
    return { success: false, errMsg: error };
  }
};

export const uploadImage = async (filePath: string): Promise<string> => {
  try {
    const cloudPath = `fruit-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const res = await Taro.cloud.uploadFile({
      cloudPath,
      filePath
    });
    return res.fileID;
  } catch (error) {
    console.error('上传图片失败:', error);
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

export const getMiniProgramCode = async (): Promise<string> => {
  try {
    const res = await Taro.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getMiniProgramCode'
      }
    });

    console.log('getMiniProgramCode 完整返回:', res);

    if (res.result) {
      console.log('res.result:', res.result);
      
      if (res.result.fileID) {
        return res.result.fileID;
      }
      if (res.result.data && res.result.data.fileID) {
        return res.result.data.fileID;
      }
      if (typeof res.result === 'string') {
        return res.result;
      }
    }

    throw new Error('获取小程序码失败，返回格式不正确');
  } catch (error) {
    console.error('获取小程序码失败:', error);
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
