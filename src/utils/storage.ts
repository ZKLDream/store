import Taro from '@tarojs/taro';

const LIST_KEY = 'fruitList';
const SALES_RECORDS_KEY = 'fruitSalesRecords';
const USER_PROFILE_KEY = 'userProfile';

const DEFAULT_USER_PROFILE = {
  avatar: '🍎',
  name: '水果店老板'
};

export const storage = {
  getList: () => {
    try {
      const data = Taro.getStorageSync(LIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getList error', e);
      return [];
    }
  },

  setList: (list: any[]) => {
    try {
      Taro.setStorageSync(LIST_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('[Storage] setList error', e);
    }
  },

  getSalesRecords: () => {
    try {
      const data = Taro.getStorageSync(SALES_RECORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getSalesRecords error', e);
      return [];
    }
  },

  setSalesRecords: (salesRecords: any[]) => {
    try {
      Taro.setStorageSync(SALES_RECORDS_KEY, JSON.stringify(salesRecords));
    } catch (e) {
      console.error('[Storage] setSalesRecords error', e);
    }
  },

  getUserProfile: () => {
    try {
      const data = Taro.getStorageSync(USER_PROFILE_KEY);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch (e) {
      console.error('[Storage] getUserProfile error', e);
      return DEFAULT_USER_PROFILE;
    }
  },

  setUserProfile: (profile: { avatar?: string; name?: string }) => {
    try {
      const current = storage.getUserProfile();
      const updated = { ...current, ...profile };
      Taro.setStorageSync(USER_PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[Storage] setUserProfile error', e);
    }
  }
};
