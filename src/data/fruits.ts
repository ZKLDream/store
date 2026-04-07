import { Fruit } from '@/types';
import { getFruitsData } from '@/utils/cloud';

export const specs = ['1斤', '2斤', '3斤', '5斤'];

export const fetchFruitsData = async (): Promise<Fruit[]> => {
  return await getFruitsData();
};

export const getCategoriesFromData = (data: Fruit[]): string[] => {
  return [...new Set(data.map(f => f.category))];
};

