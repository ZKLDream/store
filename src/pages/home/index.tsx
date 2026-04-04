import React, { useState } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { fruitsData, specs, categories } from '@/data/fruits';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState(categories[0]);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<number, string>>({});
  const { addToCart } = useApp();

  const products = fruitsData.filter(f => f.category === currentCategory);

  const handleSelectSpec = (productId: number, spec: string) => {
    setSelectedSpecs(prev => ({ ...prev, [productId]: spec }));
  };

  const handleAddToCart = (productId: number, spec: string, price: number) => {
    const fruit = fruitsData.find(f => f.id === productId);
    if (fruit) {
      addToCart(productId, fruit.name, fruit.image, spec, price);
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
            specs={specs}
            selectedSpec={selectedSpecs[fruit.id] || specs[0]}
            onSelectSpec={(spec) => handleSelectSpec(fruit.id, spec)}
            onAddToCart={(spec, price) => handleAddToCart(fruit.id, spec, price)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomePage;
