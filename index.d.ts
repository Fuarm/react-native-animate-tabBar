import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import * as React from 'react'
import BottomTabBar from './components/BottomTabBar'

export type BottomTabBar = (props: BottomTabBarProps & {
  theme?: string;
}) => React.Component

