import Taro from '@tarojs/taro';
import { insertSalesRecord, getSalesRecordsFromCloud } from './cloud';

const LIST_KEY = 'fruitList';
const SALES_RECORDS_KEY = 'fruitSalesRecords';
const USER_PROFILE_KEY = 'userProfile';

const DEFAULT_USER_PROFILE = {
  avatar: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=friendly%20fruit%20shop%20owner%20surrounded%20by%20fresh%20fruits%20like%20apples%20oranges%20bananas%2C%20smiling%20happy%20expression%2C%20cartoon%20style%2C%20high%20quality%2C%20portrait&image_size=square_hd',
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

  getSalesRecords: async () => {
    try {
      const cloudRecords = await getSalesRecordsFromCloud();
      if (cloudRecords !== null && cloudRecords !== undefined) {
        Taro.setStorageSync(SALES_RECORDS_KEY, JSON.stringify(cloudRecords));
        return cloudRecords;
      }
    } catch (e) {
      console.error('[Storage] getSalesRecords from cloud error, falling back to local', e);
    }

    try {
      const data = Taro.getStorageSync(SALES_RECORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getSalesRecords local error', e);
      return [];
    }
  },

  setSalesRecords: async (salesRecords: any[]) => {
    try {
      Taro.setStorageSync(SALES_RECORDS_KEY, JSON.stringify(salesRecords));
    } catch (e) {
      console.error('[Storage] setSalesRecords local error', e);
    }

    if (salesRecords.length > 0) {
      const latestRecord = salesRecords[0];
      try {
        await insertSalesRecord(latestRecord);
      } catch (e) {
        console.error('[Storage] setSalesRecords cloud error', e);
      }
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
