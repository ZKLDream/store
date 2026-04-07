import React, { useState } from 'react';
import { View, Text, Image, Button, Input } from '@tarojs/components';
import { ListItem } from '@/types';
import styles from './index.module.scss';

interface CartItemProps {
  item: ListItem;
  onUpdateQuantity: (itemId: number, delta: number) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
  onUpdateCostPrice: (itemId: number, costPrice: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onUpdateQuantity, 
  onUpdatePrice, 
  onUpdateCostPrice 
}) => {
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [inputPrice, setInputPrice] = useState(item.price.toString());
  const [inputCostPrice, setInputCostPrice] = useState(item.costPrice.toString());

  const profit = (item.price - item.costPrice) * item.quantity;

  const handleOpenPriceModal = () => {
    setInputPrice(item.price.toString());
    setShowPriceModal(true);
  };

  const handleConfirmPrice = () => {
    const newPrice = parseFloat(inputPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onUpdatePrice(item.id, newPrice);
    }
    setShowPriceModal(false);
  };

  const handleOpenCostModal = () => {
    setInputCostPrice(item.costPrice.toString());
    setShowCostModal(true);
  };

  const handleConfirmCostPrice = () => {
    const newCostPrice = parseFloat(inputCostPrice);
    if (!isNaN(newCostPrice) && newCostPrice >= 0) {
      onUpdateCostPrice(item.id, newCostPrice);
    }
    setShowCostModal(false);
  };

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
        <Text className={styles.cartItemSpec}>规格: 1斤</Text>
        <View className={styles.priceInfo}>
          <Text 
            className={styles.cartItemPrice} 
            onClick={handleOpenPriceModal}
          >
            售价: ¥{item.price.toFixed(1)}
          </Text>
          <Text 
            className={styles.cartItemCostPrice} 
            onClick={handleOpenCostModal}
          >
            成本: ¥{item.costPrice.toFixed(1)}
          </Text>
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

      {showPriceModal && (
        <View className={styles.modalOverlay} onClick={() => setShowPriceModal(false)}>
          <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>修改售价</Text>
            <View className={styles.inputContainer}>
              <Input
                className={styles.priceInput}
                type='digit'
                value={inputPrice}
                onInput={(e) => setInputPrice(e.detail.value)}
                placeholder='请输入售价'
              />
              <Text className={styles.unitText}>元</Text>
            </View>
            <View className={styles.modalButtons}>
              <Button
                className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
                onClick={() => setShowPriceModal(false)}
              >
                取消
              </Button>
              <Button
                className={`${styles.modalBtn} ${styles.modalBtnConfirm}`}
                onClick={handleConfirmPrice}
              >
                确认
              </Button>
            </View>
          </View>
        </View>
      )}

      {showCostModal && (
        <View className={styles.modalOverlay} onClick={() => setShowCostModal(false)}>
          <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>修改成本</Text>
            <View className={styles.inputContainer}>
              <Input
                className={styles.priceInput}
                type='digit'
                value={inputCostPrice}
                onInput={(e) => setInputCostPrice(e.detail.value)}
                placeholder='请输入成本'
              />
              <Text className={styles.unitText}>元</Text>
            </View>
            <View className={styles.modalButtons}>
              <Button
                className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
                onClick={() => setShowCostModal(false)}
              >
                取消
              </Button>
              <Button
                className={`${styles.modalBtn} ${styles.modalBtnConfirm}`}
                onClick={handleConfirmCostPrice}
              >
                确认
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CartItem;
