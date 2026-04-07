import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { AppProvider } from './store/AppContext';
import './app.scss';

function App(props) {
  useEffect(() => {
    if (Taro.cloud) {
      Taro.cloud.init({
        env: 'cloudbase-7gtch60w7e16d4ef',
        traceUser: true,
      });
    }
  }, []);
  
  useDidShow(() => {});
  useDidHide(() => {});

  return <AppProvider>{props.children}</AppProvider>;
}

export default App;
