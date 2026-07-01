import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { VideoCollection } from '@/types';
import { getCollections, removeCollection } from '@/utils/videoCollection';
import styles from './index.module.scss';

// 无封面字段，用标题字符做种子生成稳定的渐变色，视觉上区分不同合集。
const GRADIENTS = [
  ['#5ec8b8', '#2f9e8f'],
  ['#6db4e6', '#3f83c4'],
  ['#7fc9a0', '#4fa377'],
  ['#8aa9e6', '#5f7fcf'],
  ['#f0a988', '#dd8460'],
  ['#a5b8d6', '#7f92b5'],
];

const pickGradient = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const [from, to] = GRADIENTS[hash % GRADIENTS.length];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
};

const VideoCollectionListPage: React.FC = () => {
  const [collections, setCollections] = useState<VideoCollection[]>([]);

  useDidShow(() => {
    setCollections(getCollections());
  });

  const handleOpen = (item: VideoCollection) => {
    Taro.navigateTo({
      url: `/pages/video-collection-player/index?id=${item.id}`,
    });
  };

  const handleDelete = async (item: VideoCollection) => {
    const modal = await Taro.showModal({
      title: '删除合集',
      content: `确定删除《${item.title}》吗？`,
      confirmText: '删除',
      cancelText: '取消',
    });
    if (modal.confirm) {
      removeCollection(item.id);
      setCollections(getCollections());
      Taro.showToast({ title: '已删除', icon: 'success' });
    }
  };

  return (
    <View className={styles.container}>
      {collections.length === 0 ? (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🎬</Text>
          <Text className={styles.emptyText}>还没有提取的合集</Text>
          <Text className={styles.emptyHint}>前往去水印页，粘贴合集链接后点击「提取合集」</Text>
        </View>
      ) : (
        <ScrollView className={styles.scroll} scrollY>
          {collections.map((item) => (
            <View
              key={item.id}
              className={styles.card}
              onClick={() => handleOpen(item)}
              onLongPress={() => handleDelete(item)}
            >
              <View
                className={styles.cover}
                style={{ background: pickGradient(item.title || item.id) }}
              >
                <Text className={styles.coverText}>{(item.title || '合集').slice(0, 6)}</Text>
                <View className={styles.coverBadge}>
                  <Text className={styles.coverBadgeText}>{item.episodeCount}集</Text>
                </View>
              </View>
              <View className={styles.info}>
                <Text className={styles.title}>{item.title}</Text>
                {item.author ? <Text className={styles.author}>{item.author}</Text> : null}
                <Text className={styles.meta}>共 {item.episodeCount} 集</Text>
              </View>
              <Text className={styles.arrow}>›</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default VideoCollectionListPage;
