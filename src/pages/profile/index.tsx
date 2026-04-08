import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import { getUserOpenId, UserInfo, createCollection, getMiniProgramCode } from '@/utils/cloud';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const { userAvatar, userName, salesRecords } = useApp();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [miniProgramCode, setMiniProgramCode] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const totalRecords = salesRecords.length;

  useEffect(() => {
    loadUserInfo();
    initCollection();
    loadMiniProgramCode();
  }, []);

  const initCollection = async () => {
    try {
      const result = await createCollection();
      console.log('初始化集合结果:', result);
    } catch (error) {
      console.error('初始化集合失败:', error);
    }
  };

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await getUserOpenId();
      setUserInfo(info);
    } catch (err) {
      setError('获取用户信息失败，请重试');
      console.error('加载用户信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMiniProgramCode = async () => {
    try {
      setCodeLoading(true);
      const codeUrl = await getMiniProgramCode();
      setMiniProgramCode(codeUrl);
    } catch (error) {
      console.error('加载小程序码失败:', error);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleGoToRecords = () => {
    Taro.navigateTo({
      url: '/pages/sales-record-list/index'
    });
  };

  const handleGoToProductManagement = () => {
    Taro.navigateTo({
      url: '/pages/product-management/index'
    });
  };

  const displayName = userName || '用户';
  const displayId = userInfo?.openid ? `${userInfo.openid.slice(0, 8)}...` : '';

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} scrollY>
        <View className={styles.profileSection}>
          <View className={styles.avatarWrapper}>
            {userAvatar ? (
              <Image className={styles.avatar} src={userAvatar} mode="aspectFill" />
            ) : (
              <View className={styles.avatarPlaceholder}>
                <Text className={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text className={styles.userName}>{displayName}</Text>
          {loading ? (
            <Text className={styles.userId}>加载中...</Text>
          ) : error ? (
            <Text className={styles.userIdError} onClick={loadUserInfo}>{error}</Text>
          ) : displayId ? (
            <Text className={styles.userId}>{displayId}</Text>
          ) : null}
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

        <View className={styles.entranceCard} onClick={handleGoToProductManagement}>
          <View className={styles.entranceLeft}>
            <Text className={styles.entranceIcon}>🍎</Text>
            <View className={styles.entranceInfo}>
              <Text className={styles.entranceTitle}>商品管理</Text>
              <Text className={styles.entranceDesc}>编辑商品信息</Text>
            </View>
          </View>
          <Text className={styles.entranceArrow}>›</Text>
        </View>

        <View className={styles.qrCodeSection}>
          <Text className={styles.introTitle}>小程序码</Text>
          {codeLoading ? (
            <View className={styles.qrCodeLoading}>
              <Text className={styles.loadingText}>加载中...</Text>
            </View>
          ) : miniProgramCode ? (
            <View className={styles.qrCodeContainer}>
              <Image className={styles.qrCodeImage} src={miniProgramCode} mode="aspectFit" />
              <Text className={styles.qrCodeTip}>扫码进入小程序</Text>
            </View>
          ) : (
            <View className={styles.qrCodeError}>
              <Text className={styles.errorText}>加载小程序码失败</Text>
            </View>
          )}
        </View>

        <View className={styles.introSection}>
          <Text className={styles.introTitle}>关于本小程序</Text>
          <Text className={styles.introText}>
            这是一款水果店销售清单记录工具，用于记录每日销售商品、计算销售额和利润。所有数据存储在本地，不是电商平台，不提供在线购买功能。
          </Text>
        </View>

        <Text className={styles.versionInfo}>
          版本 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
