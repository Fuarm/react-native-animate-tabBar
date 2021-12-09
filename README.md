# react-native-animate-tabBar
基于 @react-navigation/bottom-tabs 的自定义 tabBar 组件

主要实现来自 **参考文档** 第一条

### 案例

![avatar](./assets/images/case.png)

### 安装
```
yarn add @react-native/animate-tabbar

```

### 使用
``` js

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabBar from '@react-native/animate-tabbar';

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      tabBar={props => <BottomTabBar {...props} theme='rgba(255,0,0, 0.5)' />}
    >
        // screen
        /**
         * 受支持的 options
         * title
         * tabBarLabel
         * tabBarIcon (没有不会报错，但不好看)
         * tabBarActiveTintColor
         * tabBarInactiveTintColor
         */ 
        <BottomTab.Screen name="Home" component={HomeScren} />

        // 其他的 screen
        ....

    </BottomTab.Navigator>
  );
}

```

### 参考文档
1、[https://github.com/wcandillon/can-it-be-done-in-react-native/tree/master/bonuses/tabbar](https://github.com/wcandillon/can-it-be-done-in-react-native/tree/master/bonuses/tabbar)

2、[https://reactnavigation.org/docs/bottom-tab-navigator/](https://reactnavigation.org/docs/bottom-tab-navigator/)






