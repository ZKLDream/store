import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import { useApp } from '@/store/AppContext';
import CartItem from '@/components/CartItem';
import styles from './index.module.scss';

const CartPage: React.FC = () => {
  const { cart, updateCartItemQuantity, getCartTotal, createOrder } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowModal(true);
  };

  const handleSubmitOrder = () => {
    if (!name || !phone || !address) {
      return;
    }
    createOrder({ name, phone, address });
    setShowModal(false);
    setName('');
    setPhone('');
    setAddress('');
  };

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} scrollY>
        {cart.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🛒</Text>
            <Text className={styles.emptyText}>购物车是空的，快去挑选水果吧~</Text>
          </View>
        ) : (
          cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateCartItemQuantity}
            />
          ))
        )}
      </ScrollView>
      
      {cart.length > 0 && (
        <View className={styles.cartFooter}>
          <View className={styles.totalPrice}>
            <Text>合计: </Text>
            <Text className={styles.totalAmount}>¥{getCartTotal().toFixed(2)}</Text>
          </View>
          <Button className={styles.checkoutBtn} onClick={handleCheckout}>
            下单
          </Button>
        </View>
      )}

      {showModal && (
        <View className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>填写收货地址</Text>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>收货人</Text>
              <Input
                className={styles.formInput}
                value={name}
                onInput={(e) => setName(e.detail.value)}
                placeholder='请输入收货人姓名'
              />
            </View>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>联系电话</Text>
              <Input
                className={styles.formInput}
                value={phone}
                onInput={(e) => setPhone(e.detail.value)}
                placeholder='请输入联系电话'
              />
            </View>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>详细地址</Text>
              <Input
                className={styles.formInput}
                value={address}
                onInput={(e) => setAddress(e.detail.value)}
                placeholder='请输入详细地址'
              />
            </View>
            <View className={styles.modalButtons}>
              <Button className={`${styles.modalBtn} ${styles.modalBtnCancel}`} onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button className={`${styles.modalBtn} ${styles.modalBtnConfirm}`} onClick={handleSubmitOrder}>
                提交订单
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CartPage;
