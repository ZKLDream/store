import Taro from '@tarojs/taro';
import { insertSalesRecord, getSalesRecordsFromCloud, createBeforeListCollection, getBeforeList, updateBeforeList, insertBeforeList } from './cloud';

const LIST_KEY = 'fruitList';
const SALES_RECORDS_KEY = 'fruitSalesRecords';
const USER_PROFILE_KEY = 'userProfile';
const BEFORE_LIST_ID = 1;

const DEFAULT_USER_PROFILE = {
  avatar: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=friendly%20fruit%20shop%20owner%20surrounded%20by%20fresh%20fruits%20like%20apples%20oranges%20bananas%2C%20smiling%20happy%20expression%2C%20cartoon%20style%2C%20high%20quality%2C%20portrait&image_size=square_hd',
  name: '水果店老板'
};

export const storage = {
  getList: async () => {
    try {
      await createBeforeListCollection();
      const cloudRecords = await getBeforeList();
      if (cloudRecords && cloudRecords.length > 0) {
        const listRecord = cloudRecords[0];
        Taro.setStorageSync(LIST_KEY, JSON.stringify(listRecord.items));
        return listRecord.items;
      }
    } catch (e) {
      console.error('[Storage] getList from cloud error, falling back to local', e);
    }

    try {
      const data = Taro.getStorageSync(LIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getList local error', e);
      return [];
    }
  },

  setList: async (list: any[]) => {
    try {
      Taro.setStorageSync(LIST_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('[Storage] setList local error', e);
    }

    try {
      await createBeforeListCollection();
      const cloudRecords = await getBeforeList();
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      const totalSales = list.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalProfit = list.reduce((sum, item) => sum + (item.price - item.costPrice) * item.quantity, 0);

      const listRecord = {
        id: BEFORE_LIST_ID,
        items: list,
        totalSales: totalSales,
        totalProfit: totalProfit,
        date: today
      };

      if (cloudRecords && cloudRecords.length > 0) {
        const existingRecord = cloudRecords[0];
        listRecord._id = existingRecord._id;
        await updateBeforeList(listRecord);
      } else {
        await insertBeforeList(listRecord);
      }
    } catch (e) {
      console.error('[Storage] setList cloud error', e);
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
