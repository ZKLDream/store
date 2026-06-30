import React, { useState } from 'react';
import { View, Text, Image, Button, Input } from '@tarojs/components';
import { Fruit } from '@/types';
import { hasProductVideo } from '@/utils/productMedia';
import styles from './index.module.scss';

interface ProductCardProps {
  fruit: Fruit;
  onAddToList: (weight: number, unitPrice: number, unitCostPrice: number, quantity: number) => void;
  onPreviewVideo?: (fruit: Fruit) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  fruit,
  onAddToList,
  onPreviewVideo
}) => {
  const [showModal, setShowModal] = useState(false);
  const [weight, setWeight] = useState('1');
  const [inputWeight, setInputWeight] = useState('1');
  const videoEnabled = hasProductVideo(fruit);

  const handleOpenModal = () => {
    setInputWeight(weight);
    setShowModal(true);
  };

  const handleConfirm = () => {
    const numWeight = parseFloat(inputWeight);
    if (isNaN(numWeight) || numWeight <= 0) {
      return;
    }
    setWeight(inputWeight);
    onAddToList(numWeight, fruit.price, fruit.costPrice, numWeight);
    setShowModal(false);
  };

  const totalPrice = fruit.price.toFixed(1);

  return (
    <View className={styles.productCard}>
      <View
        className={`${styles.productImageWrapper} ${videoEnabled ? styles.productImageWrapperClickable : ''}`}
        onClick={() => videoEnabled && onPreviewVideo?.(fruit)}
      >
        <Image
          className={styles.productImage}
          src={fruit.image}
          mode='aspectFill'
          lazyLoad
        />
        {videoEnabled && (
          <View className={styles.playBadge}>
            <Text className={styles.playIcon}>▶</Text>
          </View>
        )}
      </View>
      <View className={styles.productInfo}>
        <View>
          <Text className={styles.productName}>{fruit.name}</Text>
          <Text className={styles.productDesc}>{fruit.desc}</Text>
        </View>
        <View className={styles.productBottom}>
          <View className={styles.productPrice}>
            <Text className={styles.priceUnit}>¥</Text>
            <Text>{totalPrice}</Text>
          </View>
          <Button
            className={styles.addToList}
            onClick={handleOpenModal}
          >
            加入清单
          </Button>
        </View>
      </View>

      {showModal && (
        <View className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>选择斤数</Text>
            <View className={styles.inputContainer}>
              <Input
                className={styles.weightInput}
                type='digit'
                value={inputWeight}
                onInput={(e) => setInputWeight(e.detail.value)}
                placeholder='请输入斤数'
              />
              <Text className={styles.unitText}>斤</Text>
            </View>
            <View className={styles.modalButtons}>
              <Button
                className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
                onClick={() => setShowModal(false)}
              >
                取消
              </Button>
              <Button
                className={`${styles.modalBtn} ${styles.modalBtnConfirm}`}
                onClick={handleConfirm}
              >
                确认
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProductCard;
