import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Fruit } from '@/types';
import { getFruitsData, updateFruit, deleteFruit, uploadImage, getMiniProgramCode } from '@/utils/cloud';
import styles from './index.module.scss';

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Fruit | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Partial<Fruit>>({});
  const [saving, setSaving] = useState(false);
  const [miniProgramCode, setMiniProgramCode] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadMiniProgramCode();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getFruitsData();
      setProducts(data);
    } catch (error) {
      console.error('加载商品失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
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

  const handleProductClick = (product: Fruit) => {
    setSelectedProduct(product);
    setEditData({ ...product });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setEditData({});
  };

  const handleInputChange = (field: keyof Fruit, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'costPrice' ? Number(value) || 0 : value
    }));
  };

  const handleImageUpload = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });

      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        Taro.showLoading({ title: '上传中...' });
        const fileId = await uploadImage(res.tempFilePaths[0]);
        setEditData(prev => ({ ...prev, image: fileId }));
        Taro.hideLoading();
        Taro.showToast({
          title: '上传成功',
          icon: 'success'
        });
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      Taro.hideLoading();
      Taro.showToast({
        title: '上传失败',
        icon: 'none'
      });
    }
  };

  const handleSave = async () => {
    if (!selectedProduct || !editData.name || !editData.category) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (!selectedProduct._id) {
      Taro.showToast({
        title: '缺少 _id 字段',
        icon: 'none'
      });
      return;
    }

    try {
      setSaving(true);
      const updatedProduct: Fruit = {
        _id: selectedProduct._id,
        id: selectedProduct.id,
        category: editData.category || selectedProduct.category,
        name: editData.name || selectedProduct.name,
        desc: editData.desc || selectedProduct.desc,
        price: editData.price ?? selectedProduct.price,
        costPrice: editData.costPrice ?? selectedProduct.costPrice,
        image: editData.image || selectedProduct.image
      };

      const result = await updateFruit([updatedProduct]);
      if (result.success) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        });
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
        handleCloseModal();
      } else {
        Taro.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('保存失败:', error);
      Taro.showToast({
        title: '保存失败',
        icon: 'none'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    if (!selectedProduct._id) {
      Taro.showToast({
        title: '缺少 _id 字段',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '确认删除',
      content: `确定要删除商品「${selectedProduct.name}」吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            setSaving(true);
            const result = await deleteFruit(selectedProduct._id);
            if (result.success) {
              Taro.showToast({
                title: '删除成功',
                icon: 'success'
              });
              setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
              handleCloseModal();
            } else {
              Taro.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('删除失败:', error);
            Taro.showToast({
              title: '删除失败',
              icon: 'none'
            });
          } finally {
            setSaving(false);
          }
        }
      }
    });
  };

  if (loading) {
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
        <View className={styles.productsSection}>
          <Text className={styles.sectionTitle}>商品列表</Text>
          {products.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🍎</Text>
              <Text className={styles.emptyText}>暂无商品</Text>
            </View>
          ) : (
            <View className={styles.productList}>
              {products.map(product => (
                <View
                  key={product.id}
                  className={styles.productItem}
                  onClick={() => handleProductClick(product)}
                >
                  <View className={styles.productHeader}>
                    <Image className={styles.productImage} src={product.image} mode="aspectFill" />
                    <View className={styles.productInfo}>
                      <Text className={styles.productName}>{product.name}</Text>
                      <Text className={styles.productId}>ID: {product.id}</Text>
                    </View>
                  </View>
                  <Text className={styles.productDesc}>{product.desc}</Text>
                  <View className={styles.productMeta}>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaLabel}>分类</Text>
                      <Text className={styles.metaValue}>{product.category}</Text>
                    </View>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaLabel}>售价</Text>
                      <Text className={`${styles.metaValue} ${styles.price}`}>¥{product.price.toFixed(2)}</Text>
                    </View>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaLabel}>成本</Text>
                      <Text className={`${styles.metaValue} ${styles.costPrice}`}>¥{product.costPrice.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className={styles.qrCodeSection}>
          <Text className={styles.sectionTitle}>小程序码</Text>
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
      </ScrollView>

      {showModal && selectedProduct && (
        <View className={styles.modalOverlay} onClick={handleCloseModal}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>编辑商品</Text>
              <Text className={styles.modalClose} onClick={handleCloseModal}>×</Text>
            </View>
            <View className={styles.modalBody}>
              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>ID</Text>
                <Input
                  className={styles.formInput}
                  disabled
                  value={String(editData.id || '')}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>分类</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入分类"
                  value={editData.category || ''}
                  onInput={(e) => handleInputChange('category', e.detail.value)}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>商品名称</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入商品名称"
                  value={editData.name || ''}
                  onInput={(e) => handleInputChange('name', e.detail.value)}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>商品描述</Text>
                <Textarea
                  className={`${styles.formInput} ${styles.formTextarea}`}
                  placeholder="请输入商品描述"
                  value={editData.desc || ''}
                  onInput={(e) => handleInputChange('desc', e.detail.value)}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>售价</Text>
                <Input
                  className={styles.formInput}
                  type="digit"
                  placeholder="请输入售价"
                  value={String(editData.price ?? '')}
                  onInput={(e) => handleInputChange('price', e.detail.value)}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>成本价</Text>
                <Input
                  className={styles.formInput}
                  type="digit"
                  placeholder="请输入成本价"
                  value={String(editData.costPrice ?? '')}
                  onInput={(e) => handleInputChange('costPrice', e.detail.value)}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>商品图片</Text>
                <View className={styles.imageUpload}>
                  {editData.image ? (
                    <Image className={styles.previewImage} src={editData.image} mode="aspectFill" />
                  ) : (
                    <View className={styles.previewImage} />
                  )}
                  <View className={styles.uploadButton} onClick={handleImageUpload}>
                    选择图片
                  </View>
                </View>
              </View>
            </View>
            <View className={styles.modalFooter}>
              <View className={`${styles.modalButton} ${styles.delete}`} onClick={handleDelete}>
                删除
              </View>
              <View className={`${styles.modalButton} ${styles.cancel}`} onClick={handleCloseModal}>
                取消
              </View>
              <View className={`${styles.modalButton} ${styles.save}`} onClick={handleSave}>
                {saving ? '保存中...' : '保存'}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProductManagementPage;
