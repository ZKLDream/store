import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

const SalesRecordListPage: React.FC = () => {
  const { salesRecords, salesRecordsLoading } = useApp();

  const sortedRecords = [...salesRecords].sort((a, b) => b.id - a.id);

  const handleRecordClick = (id: number) => {
    Taro.navigateTo({
      url: `/pages/sales-record-detail/index?id=${id}`
    });
  };

  if (salesRecordsLoading) {
    return (
      <View className={styles.container}>
        <View className={styles.loadingContainer}>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} scrollY>
        <View className={styles.recordsSection}>
          <Text className={styles.sectionTitle}>销售记录</Text>
          {sortedRecords.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>暂无销售记录</Text>
            </View>
          ) : (
            <View className={styles.recordList}>
              {sortedRecords.map(record => (
                <View
                  key={record.id}
                  className={styles.recordItem}
                  onClick={() => handleRecordClick(record.id)}
                >
                  <View className={styles.recordDate}>
                    <Text className={styles.dateText}>{record.date}</Text>
                  </View>
                  <View className={styles.recordStats}>
                    <View className={styles.statItem}>
                      <Text className={styles.statLabel}>总销售额</Text>
                      <Text className={styles.statValue}>¥{record.totalSales.toFixed(2)}</Text>
                    </View>
                    <View className={styles.statItem}>
                      <Text className={styles.statLabel}>总利润</Text>
                      <Text className={`${styles.statValue} ${styles.profit}`}>¥{record.totalProfit.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SalesRecordListPage;
