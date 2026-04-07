import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const { salesRecords } = useApp();
  const totalRecords = salesRecords.length;

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} scrollY>
        {/* 记账本信息 */}
        <View className={styles.section}>
          <View className={styles.profileCard}>
            <Text className={styles.profileTitle}>水果店记账本</Text>
            <Text className={styles.profileInfo}>
              这是一款专为水果店设计的记账工具，帮助您记录每日销售情况和计算盈利。
            </Text>
            <Text className={styles.profileInfo} style={{ marginTop: '12rpx' }}>
              已记录 <Text style={{ color: '#667eea', fontWeight: '600' }}>{totalRecords}</Text> 条销售记录
            </Text>
          </View>
        </View>

        {/* 使用说明 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>使用说明</Text>
          <View className={styles.instructionList}>
            <Text className={styles.instructionItem}>
              在首页浏览水果商品，选择规格后点击"加入清单"
            </Text>
            <Text className={styles.instructionItem}>
              在清单页面查看销售详情，包括数量、成本价、售价和利润
            </Text>
            <Text className={styles.instructionItem}>
              调整商品数量或移除不需要的商品
            </Text>
            <Text className={styles.instructionItem}>
              点击"结算"按钮完成当日销售记录，系统会自动计算总销售额和总利润
            </Text>
            <Text className={styles.instructionItem}>
              所有数据保存在本地，确保您的销售信息安全
            </Text>
          </View>
        </View>

        {/* 功能特点 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>功能特点</Text>
          <View className={styles.instructionList}>
            <Text className={styles.instructionItem}>
              支持多种水果分类和规格选择
            </Text>
            <Text className={styles.instructionItem}>
              自动计算每个商品的利润
            </Text>
            <Text className={styles.instructionItem}>
              实时显示总销售额和总利润
            </Text>
            <Text className={styles.instructionItem}>
              简洁直观的操作界面
            </Text>
            <Text className={styles.instructionItem}>
              符合个人主体小程序审核要求
            </Text>
          </View>
        </View>

        {/* 版本信息 */}
        <Text className={styles.versionInfo}>
          版本 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
