import Taro from '@tarojs/taro';
import { VideoCollection, VideoEpisode } from '@/types';
import { HejiExtractResponse } from './videoParse';

const STORAGE_KEY = 'video_collections';

export const getCollections = (): VideoCollection[] => {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY);
    if (Array.isArray(raw)) {
      return raw as VideoCollection[];
    }
  } catch (e) {}
  return [];
};

export const getCollectionById = (id: string): VideoCollection | undefined =>
  getCollections().find((item) => item.id === id);

const persist = (collections: VideoCollection[]) => {
  Taro.setStorageSync(STORAGE_KEY, collections);
};

export const saveCollection = (collection: VideoCollection): void => {
  const collections = getCollections().filter((item) => item.id !== collection.id);
  collections.unshift(collection);
  persist(collections);
};

export const removeCollection = (id: string): void => {
  persist(getCollections().filter((item) => item.id !== id));
};

// 抖音合集接口 items 无封面字段，标题取第一集，作者取第一集作者。
export const buildCollectionFromExtract = (
  response: HejiExtractResponse,
  sourceUrl: string
): VideoCollection | null => {
  const rawItems = Array.isArray(response.items) ? response.items : [];
  const episodes: VideoEpisode[] = rawItems
    .map((item, idx) => ({
      index: typeof item.index === 'number' ? item.index : idx + 1,
      title: (item.title || '').trim(),
      author: (item.author || '').trim(),
      duration: (item.duration || '').trim(),
      videoUrl: (item.video_url || '').trim(),
      downloadUrl: (item.download_url || '').trim(),
    }))
    .filter((item) => item.downloadUrl.length > 0);

  if (episodes.length === 0) {
    return null;
  }

  const first = episodes[0];
  const title = first.title || first.author || '未命名合集';

  return {
    id: response.item_id || `${Date.now()}`,
    title,
    author: first.author,
    sourceUrl,
    episodeCount: episodes.length,
    episodes,
    createdAt: Date.now(),
  };
};
