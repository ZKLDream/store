import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

const OrdersPage: React.FC = () => {
  const { orders } = useApp();

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} scrollY>
        {orders.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无订单</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order.id} className={styles.orderCard}>
              <View className={styles.orderHeader}>
                <View>
                  <Text className={styles.orderId}>订单号: {order.id}</Text>
                  <Text className={styles.orderTime}>{order.time}</Text>
                </View>
                <Text className={styles.orderStatus}>{order.status}</Text>
              </View>
              <View className={styles.orderItems}>
                {order.items.map(item => (
                  <View key={item.id} className={styles.orderItem}>
                    <Text className={styles.orderItemName}>
                      {item.name} x {item.quantity} ({item.spec})
                    </Text>
                    <Text className={styles.orderItemPrice}>
                      ¥{(item.price * item.quantity).toFixed(1)}
                    </Text>
                  </View>
                ))}
              </View>
              <View className={styles.orderAddress}>
                <Text>📍 {order.address.name} {order.address.phone}</Text>
                <Text>{order.address.address}</Text>
              </View>
              <View className={styles.orderFooter}>
                <View className={styles.orderTotal}>
                  共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品，合计: 
                  <Text className={styles.orderTotalAmount}>¥{order.total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default OrdersPage;
