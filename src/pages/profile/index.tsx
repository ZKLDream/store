import React from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const { userAvatar, userName, salesRecords } = useApp();

  const sortedRecords = [...salesRecords].sort((a, b) => b.id - a.id);

  const handleRecordClick = (id: number) => {
    Taro.navigateTo({
      url: `/pages/sales-record-detail/index?id=${id}`
    });
  };

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} scrollY>
        <View className={styles.profileSection}>
          <View className={styles.avatarWrapper}>
            {userAvatar ? (
              <Image className={styles.avatar} src={userAvatar} mode="aspectFill" />
            ) : (
              <View className={styles.avatarPlaceholder}>
                <Text className={styles.avatarText}>{userName ? userName.charAt(0).toUpperCase() : '?'}</Text>
              </View>
            )}
          </View>
          <Text className={styles.userName}>{userName || '用户'}</Text>
        </View>

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

        <Text className={styles.versionInfo}>
          版本 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
