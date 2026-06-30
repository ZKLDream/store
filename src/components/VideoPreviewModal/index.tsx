import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Video } from '@tarojs/components';
import styles from './index.module.scss';

interface VideoPreviewModalProps {
  visible: boolean;
  title: string;
  videoUrl: string;
  onClose: () => void;
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  visible,
  title,
  videoUrl,
  onClose
}) => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoadError(false);
    }
  }, [visible, videoUrl]);

  const shouldRenderVideo = useMemo(() => {
    return visible && videoUrl && !loadError;
  }, [visible, videoUrl, loadError]);

  if (!visible) {
    return null;
  }

  const handleClose = () => {
    setLoadError(false);
    onClose();
  };

  const handleVideoError = () => {
    setLoadError(true);
  };

  return (
    <View className={styles.overlay} onClick={handleClose}>
      <View className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.close} onClick={handleClose}>×</Text>

        <View className={styles.playerContainer}>
          {shouldRenderVideo ? (
            <Video
              className={styles.video}
              src={videoUrl}
              autoplay
              controls
              showCenterPlayBtn
              objectFit='contain'
              onError={handleVideoError}
            />
          ) : (
            <View className={styles.errorState}>
              <Text className={styles.errorText}>视频暂时无法播放</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default VideoPreviewModal;
