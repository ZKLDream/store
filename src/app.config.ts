export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/cart/index',
    'pages/orders/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#667eea',
    navigationBarTitleText: '水果店',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#718096',
    selectedColor: '#667eea',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/cart/index',
        text: '购物车'
      },
      {
        pagePath: 'pages/orders/index',
        text: '订单'
      }
    ]
  }
})
