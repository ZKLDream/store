export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/cart/index',
    'pages/profile/index',
    'pages/sales-record-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#667eea',
    navigationBarTitleText: '水果店记账本',
    navigationBarTextStyle: 'white'
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
