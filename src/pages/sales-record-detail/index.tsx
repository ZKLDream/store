import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import CartItem from '@/components/CartItem';
import styles from './index.module.scss';

const SalesRecordDetailPage: React.FC = () => {
  const { salesRecords } = useApp();
  const router = Taro.getCurrentInstance().router;
  const id = router && router.params && router.params.id ? parseInt(router.params.id) : 0;
  
  const record = salesRecords.find(r => r.id === id);

  if (!record) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>未找到该销售记录</Text>
        </View>
      </View>
    );
  }

  const dummyUpdate = () => {};

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} scrollY>
        <View className={styles.header}>
          <Text className={styles.dateLabel}>销售时间</Text>
          <Text className={styles.date}>{record.date}</Text>
        </View>

        <View className={styles.itemsSection}>
          <Text className={styles.sectionTitle}>商品明细</Text>
          {record.items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={dummyUpdate}
              onUpdatePrice={dummyUpdate}
              onUpdateCostPrice={dummyUpdate}
            />
          ))}
        </View>

        <View className={styles.summary}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryLabel}>总销售额</Text>
            <Text className={styles.totalSales}>¥{record.totalSales.toFixed(2)}</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryLabel}>总利润</Text>
            <Text className={styles.totalProfit}>¥{record.totalProfit.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SalesRecordDetailPage;
