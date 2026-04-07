import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { Fruit } from '@/types';
import styles from './index.module.scss';

interface ProductCardProps {
  fruit: Fruit;
  specs: string[];
  selectedSpec: string;
  onSelectSpec: (spec: string) => void;
  onAddToList: (spec: string, price: number, costPrice: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  fruit,
  specs,
  selectedSpec,
  onSelectSpec,
  onAddToList
}) => {
  const specMultiplier = parseInt(selectedSpec);
  const totalPrice = (fruit.price * specMultiplier).toFixed(1);

  return (
    <View className={styles.productCard}>
      <Image
        className={styles.productImage}
        src={fruit.image}
        mode='aspectFill'
        lazyLoad
      />
      <View className={styles.productInfo}>
        <View>
          <Text className={styles.productName}>{fruit.name}</Text>
          <Text className={styles.productDesc}>{fruit.desc}</Text>
          <View className={styles.specSelector}>
            {specs.map(spec => (
              <View
                key={spec}
                className={`${styles.specItem} ${selectedSpec === spec ? styles.specItemActive : ''}`}
                onClick={() => onSelectSpec(spec)}
              >
                <Text>{spec}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.productBottom}>
          <View className={styles.productPrice}>
            <Text className={styles.priceUnit}>¥</Text>
            <Text>{totalPrice}</Text>
          </View>
          <Button
            className={styles.addToList}
            onClick={() => onAddToList(selectedSpec, fruit.price * specMultiplier, fruit.costPrice * specMultiplier)}
          >
            加入清单
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
