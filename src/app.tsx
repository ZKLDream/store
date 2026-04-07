import React from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { AppProvider } from './store/AppContext';
import './app.scss';

function App(props) {
  useDidShow(() => {});
  useDidHide(() => {});

  return <AppProvider>{props.children}</AppProvider>;
}

export default App;
