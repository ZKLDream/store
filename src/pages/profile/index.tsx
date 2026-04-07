import React from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const { userAvatar, userName, salesRecords } = useApp();
  const totalRecords = salesRecords.length;

  const handleGoToRecords = () => {
    Taro.navigateTo({
      url: '/pages/sales-record-list/index'
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

        <View className={styles.entranceCard} onClick={handleGoToRecords}>
          <View className={styles.entranceLeft}>
            <Text className={styles.entranceIcon}>📋</Text>
            <View className={styles.entranceInfo}>
              <Text className={styles.entranceTitle}>销售记录</Text>
              <Text className={styles.entranceDesc}>已记录 {totalRecords} 条</Text>
            </View>
          </View>
          <Text className={styles.entranceArrow}>›</Text>
        </View>

        <Text className={styles.versionInfo}>
          版本 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
