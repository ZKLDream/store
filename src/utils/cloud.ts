import Taro from '@tarojs/taro';
import { Fruit } from '@/types';

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
