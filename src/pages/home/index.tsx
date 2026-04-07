import React, { useState } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { fruitsData, categories } from '@/data/fruits';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState(categories[0]);
  const { addToList } = useApp();

  const products = fruitsData.filter(f => f.category === currentCategory);

  const handleAddToList = (productId: number, weight: number, unitPrice: number, unitCostPrice: number, quantity: number) => {
    const fruit = fruitsData.find(f => f.id === productId);
    if (fruit) {
      addToList(productId, fruit.name, fruit.image, `${weight}斤`, unitPrice, unitCostPrice, quantity);
    }
  };

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
