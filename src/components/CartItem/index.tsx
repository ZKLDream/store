import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { ListItem } from '@/types';
import styles from './index.module.scss';

interface CartItemProps {
  item: ListItem;
  onUpdateQuantity: (itemId: number, delta: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity }) => {
  const profit = (item.price - item.costPrice) * item.quantity;

  return (
    <View className={styles.cartItem}>
      <Image
        className={styles.cartItemImage}
        src={item.image}
        mode='aspectFill'
        lazyLoad
      />
      <View className={styles.cartItemInfo}>
        <Text className={styles.cartItemName}>{item.name}</Text>
        <Text className={styles.cartItemSpec}>规格: {item.spec}</Text>
        <View className={styles.priceInfo}>
          <Text className={styles.cartItemPrice}>售价: ¥{item.price.toFixed(1)}</Text>
          <Text className={styles.cartItemCostPrice}>成本: ¥{item.costPrice.toFixed(1)}</Text>
          <Text className={styles.cartItemProfit}>利润: ¥{profit.toFixed(1)}</Text>
        </View>
      </View>
      <View className={styles.cartItemControls}>
        <Button
          className={styles.quantityBtn}
          onClick={() => onUpdateQuantity(item.id, -1)}
        >
          -
        </Button>
        <Text className={styles.quantity}>{item.quantity}</Text>
        <Button
          className={styles.quantityBtn}
          onClick={() => onUpdateQuantity(item.id, 1)}
        >
          +
        </Button>
      </View>
    </View>
  );
};

export default CartItem;
