import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { specs, fetchFruitsData, getCategoriesFromData } from '@/data/fruits';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/store/AppContext';
import { Fruit } from '@/types';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [fruitsData, setFruitsData] = useState<Fruit[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToList } = useApp();

  useEffect(() => {
    loadFruitsData();
  }, []);

  useDidShow(() => {
    loadFruitsData();
  });

  const loadFruitsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFruitsData();
      setFruitsData(data);
      const cats = getCategoriesFromData(data);
      setCategories(cats);
      if (cats.length > 0) {
        setCurrentCategory(cats[0]);
      }
    } catch (err) {
      setError('加载数据失败，请重试');
      console.error('加载水果数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const products = fruitsData.filter(f => f.category === currentCategory);

  const handleAddToList = (productId: number, weight: number, unitPrice: number, unitCostPrice: number, quantity: number) => {
    const fruit = fruitsData.find(f => f.id === productId);
    if (fruit) {
      addToList(productId, fruit.name, fruit.image, `${weight}斤`, unitPrice, unitCostPrice, quantity);
    }
  };

  if (loading) {
    return (
      <View className={styles.container}>
        <View className={styles.loadingContainer}>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className={styles.container}>
        <View className={styles.errorContainer}>
          <Text className={styles.errorText}>{error}</Text>
          <Text className={styles.retryText} onClick={loadFruitsData}>点击重试</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <ScrollView className={styles.categorySidebar} scrollY>
        {categories.map(cat => (
          <View
            key={cat}
            className={`${styles.categoryItem} ${currentCategory === cat ? styles.categoryItemActive : ''}`}
            onClick={() => setCurrentCategory(cat)}
          >
            {cat}
          </View>
        ))}
      </ScrollView>
      <ScrollView className={styles.productList} scrollY>
        {products.map(fruit => (
          <ProductCard
            key={fruit.id}
            fruit={fruit}
            onAddToList={(weight, unitPrice, unitCostPrice, quantity) => handleAddToList(fruit.id, weight, unitPrice, unitCostPrice, quantity)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomePage;
