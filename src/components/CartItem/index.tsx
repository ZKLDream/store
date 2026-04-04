import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { CartItem as CartItemType } from '@/types';
import styles from './index.module.scss';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, delta: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity }) => {
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
        <Text className={styles.cartItemPrice}>¥{item.price.toFixed(1)}</Text>
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
