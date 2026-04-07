import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

interface TabItem {
  pagePath: string;
  text: string;
  icon: string;
}

const tabList: TabItem[] = [
  {
    pagePath: '/pages/home/index',
    text: '首页',
    icon: '🏠'
  },
  {
    pagePath: '/pages/cart/index',
    text: '清单',
    icon: '📝'
  },
  {
    pagePath: '/pages/profile/index',
    text: '我的',
    icon: '👤'
  }
];

const CustomTabBar: React.FC = () => {
  const { list } = useApp();
  const [currentPagePath, setCurrentPagePath] = useState('');
  const cartCount = list.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const updateCurrentPath = () => {
      const pages = Taro.getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const route = currentPage.route || '';
        setCurrentPagePath('/' + route);
      }
    };

    updateCurrentPath();
    
    const timer = setInterval(updateCurrentPath, 100);
    return () => clearInterval(timer);
  }, []);

  const handleTabClick = (item: TabItem) => {
    Taro.switchTab({
      url: item.pagePath
    });
  };

  return (
    <View className={styles.tabBar}>
      {tabList.map((item) => {
        const isActive = currentPagePath === item.pagePath;
        const showBadge = item.text === '清单' && cartCount > 0;

        return (
          <View
            key={item.pagePath}
            className={`${styles.tabItem} ${isActive ? styles.tabItemActive : ''}`}
            onClick={() => handleTabClick(item)}
          >
            <View className={`${styles.tabIcon} ${isActive ? styles.tabIconActive : ''}`}>
              {item.icon}
              {showBadge && (
                <View className={styles.badge}>
                  {cartCount > 99 ? '99+' : cartCount}
                </View>
              )}
            </View>
            <Text className={`${styles.tabText} ${isActive ? styles.tabTextActive : ''}`}>
              {item.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
