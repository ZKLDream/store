import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import { useApp } from '@/store/AppContext';
import CartItem from '@/components/CartItem';
import styles from './index.module.scss';

const CartPage: React.FC = () => {
  const { list, updateListItemQuantity, updateListItemPrice, updateListItemCostPrice, getListTotal, getListProfit, createSalesRecord, uploadListToCloud } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (list.length === 0) return;
    try {
      setIsCheckingOut(true);
      await createSalesRecord();
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleUpload = async () => {
    if (list.length === 0) return;
    try {
      setIsUploading(true);
      await uploadListToCloud();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} scrollY>
        {list.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>清单是空的，快去添加水果吧~</Text>
          </View>
        ) : (
          list.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateListItemQuantity}
              onUpdatePrice={updateListItemPrice}
              onUpdateCostPrice={updateListItemCostPrice}
            />
          ))
        )}
      </ScrollView>
      
      {list.length > 0 && (
        <View className={styles.cartFooter}>
          <View className={styles.totalInfo}>
            <View className={styles.totalPrice}>
              <Text>销售额: </Text>
              <Text className={styles.totalAmount}>¥{getListTotal().toFixed(2)}</Text>
            </View>
            <View className={styles.totalProfit}>
              <Text>总利润: </Text>
              <Text className={styles.profitAmount}>¥{getListProfit().toFixed(2)}</Text>
            </View>
          </View>
          <View className={styles.buttonGroup}>
            <Button className={styles.uploadBtn} onClick={handleUpload} disabled={isUploading}>
              {isUploading ? '上传中...' : '上传'}
            </Button>
            <Button className={styles.checkoutBtn} onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? '结算中...' : '结算'}
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default CartPage;
