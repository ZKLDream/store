import React, { useMemo, useState } from 'react';
import { View, Text, Video, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { VideoCollection } from '@/types';
import { getCollectionById } from '@/utils/videoCollection';
import styles from './index.module.scss';

const VideoCollectionPlayerPage: React.FC = () => {
  const router = useRouter();
  const collectionId = router.params.id || '';

  const collection = useMemo<VideoCollection | undefined>(
    () => getCollectionById(collectionId),
    [collectionId]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [panelVisible, setPanelVisible] = useState(false);

  // 自定义导航下 env(safe-area-inset-top) 在真机不可靠，返回按钮会被状态栏遮住。
  // 用微信胶囊按钮的实际位置对齐，保证与右上角「··· ◉」在同一水平线。
  const backBtnTop = useMemo(() => {
    try {
      const rect = Taro.getMenuButtonBoundingClientRect();
      if (rect && rect.top > 0) {
        return rect.top;
      }
    } catch (e) {}
    try {
      const sys = Taro.getSystemInfoSync();
      return (sys.statusBarHeight || 20) + 8;
    } catch (e) {}
    return 44;
  }, []);

  const handleBack = () => {
    Taro.navigateBack();
  };

  if (!collection || collection.episodes.length === 0) {
    return (
      <View className={styles.container}>
        <View className={styles.topBar} style={{ top: `${backBtnTop}px` }}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text className={styles.backArrow}>‹</Text>
            <Text className={styles.backLabel}>返回</Text>
          </View>
        </View>
        <View className={styles.emptyWrap}>
          <Text className={styles.emptyText}>合集不存在或已删除</Text>
        </View>
      </View>
    );
  }

  const total = collection.episodes.length;
  const current = collection.episodes[currentIndex];

  const handleSwitch = (idx: number) => {
    setCurrentIndex(idx);
    setPanelVisible(false);
  };

  return (
    <View className={styles.container}>
      <Video
        className={styles.video}
        src={current.downloadUrl}
        controls
        autoplay
        showFullscreenBtn
        showProgress
        showPlayBtn
        showCenterPlayBtn
        objectFit="contain"
        initialTime={0}
      />

      <View className={styles.topBar} style={{ top: `${backBtnTop}px` }}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backArrow}>‹</Text>
          <Text className={styles.backLabel}>返回</Text>
        </View>
      </View>

      <View className={styles.bottomInfo}>
        <View className={styles.episodeTag} onClick={() => setPanelVisible(true)}>
          <Text className={styles.episodeTagText}>
            合集 {currentIndex + 1}/{total}
          </Text>
          <Text className={styles.episodeTagArrow}>⌃</Text>
        </View>
        <Text className={styles.videoTitle}>{current.title || `第 ${currentIndex + 1} 集`}</Text>
        {collection.author ? (
          <Text className={styles.videoAuthor}>{collection.author}</Text>
        ) : null}
      </View>

      {panelVisible ? (
        <View className={styles.mask} onClick={() => setPanelVisible(false)}>
          <View className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <View className={styles.panelHeader}>
              <Text className={styles.panelTitle}>选集</Text>
              <Text className={styles.panelCount}>共 {total} 集</Text>
              <Text className={styles.panelClose} onClick={() => setPanelVisible(false)}>
                ✕
              </Text>
            </View>
            <ScrollView className={styles.panelScroll} scrollY>
              <View className={styles.grid}>
                {collection.episodes.map((ep, idx) => (
                  <View
                    key={ep.index}
                    className={`${styles.gridItem} ${idx === currentIndex ? styles.gridItemActive : ''}`}
                    onClick={() => handleSwitch(idx)}
                  >
                    <Text
                      className={`${styles.gridItemText} ${idx === currentIndex ? styles.gridItemTextActive : ''}`}
                    >
                      {idx + 1}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default VideoCollectionPlayerPage;
