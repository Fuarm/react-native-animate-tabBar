import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { SafeAreaView, StyleSheet, Animated, View } from "react-native";

import * as shape from "d3-shape";
import { Svg, Path } from 'react-native-svg';

import StaticTabBar, { height, width, tabBarTheme } from './StaticTabBar';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const tabConcaveWidth = width / 4.2;

const getPath = (): string => {
    const left = shape.line().x(d => d.x).y(d => d.y)([
        { x: 0, y: 0 },
        { x: width, y: 0 },
    ]);
    const tab = shape.line().x(d => d.x).y(d => d.y).curve(shape.curveBasis)([
        { x: width - 5, y: 0 },
        { x: width + 5, y: 2 },
        { x: width + 12, y: 15 },
        { x: width + 25, y: height - 8 },
        { x: width + tabConcaveWidth - 25, y: height - 8 },
        { x: width + tabConcaveWidth - 12, y: 15 },
        { x: width + tabConcaveWidth - 5, y: 2 },
        { x: width + tabConcaveWidth + 5, y: 0 },
    ]);
    const right = shape.line().x(d => d.x).y(d => d.y)([
        { x: width + tabConcaveWidth, y: 0 },
        { x: width * 2, y: 0 },
        { x: width * 2, y: height },
        { x: 0, y: height },
        { x: 0, y: 0 },
    ]);
    return `${left} ${tab} ${right}`;
};

const d = getPath();

const value = new Animated.Value(0);

export default function BottomTabBar(props: BottomTabBarProps & { theme?: string }) {
    // 解构参数
    const { state: {routes}, theme } = props;

    // 设置背景色
    const backgroundColor = theme || tabBarTheme.tabBarInactiveBackgroundColor;

    const offsetX = (width / routes.length - tabConcaveWidth)/2;
    const translateX = value.interpolate({
        inputRange: [0-offsetX, width],
        outputRange: [-width, 0 + offsetX],
    });

    return (
        <>
            <View {...{ height, width}}>
                <AnimatedSvg width={width * 2} {...{ height }} style={{ transform: [{ translateX }] }}>
                    <Path fill={backgroundColor} {...{d}} />
                </AnimatedSvg>
                <View style={StyleSheet.absoluteFill}>
                    <StaticTabBar {...{tabBar: props, theme, value }} />
                </View>
            </View>
            <SafeAreaView style={{backgroundColor}} />
        </>
    )
}