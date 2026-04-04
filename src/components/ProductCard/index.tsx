import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { Fruit } from '@/types';
import styles from './index.module.scss';

interface ProductCardProps {
  fruit: Fruit;
  specs: string[];
  selectedSpec: string;
  onSelectSpec: (spec: string) => void;
  onAddToCart: (spec: string, price: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  fruit,
  specs,
  selectedSpec,
  onSelectSpec,
  onAddToCart
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
            className={styles.addToCart}
            onClick={() => onAddToCart(selectedSpec, fruit.price * specMultiplier)}
          >
            加入购物车
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
