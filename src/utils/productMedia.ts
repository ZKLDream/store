type ProductVideoSource = {
  video?: string | null;
};

export const getProductVideoFileId = (product: ProductVideoSource): string => {
  if (typeof product.video !== 'string') {
    return '';
  }

  return product.video.trim();
};

export const hasProductVideo = (product: ProductVideoSource): boolean => {
  return getProductVideoFileId(product).length > 0;
};
