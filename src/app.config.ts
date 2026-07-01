export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/cart/index',
    'pages/profile/index',
    'pages/sales-record-list/index',
    'pages/sales-record-detail/index',
    'pages/product-management/index',
    'pages/video-dewatermark/index',
    'pages/video-collection-list/index',
    'pages/video-collection-player/index',
    'pages/fresh-chat/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#667eea',
    navigationBarTitleText: '水果店记账本',
    navigationBarTextStyle: 'white'
  },
  permission: {
    'scope.writePhotosAlbum': {
      desc: '用于将去水印后的视频保存到您的相册'
    }
  },
  tabBar: {
    custom: true,
    color: '#718096',
    selectedColor: '#667eea',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/cart/index',
        text: '清单'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
