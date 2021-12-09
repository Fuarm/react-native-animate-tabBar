import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavigationState, ParamListBase, PartialState, Route } from "@react-navigation/native";
import React, { Fragment, useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

interface StaticTabbarProps {
    tabBar: BottomTabBarProps;
    value: Animated.Value;
    theme?: string
}
type NavigationRoute<ParamList extends ParamListBase, RouteName extends keyof ParamList> = Route<Extract<RouteName, string>, ParamList[RouteName]> & {
    state?: NavigationState | PartialState<NavigationState>;
};

export const { width } = Dimensions.get("window");
export const height = 58;
export const tabBarTheme = {
    tabBarActiveTintColor: "#409EFF",
    tabBarInactiveTintColor: "#777",
    tabBarActiveBackgroundColor: "white",
    tabBarInactiveBackgroundColor: "white"
}

export default function StaticTabBar(props: StaticTabbarProps) {
    
    const [values, setValues] = useState<Animated.Value[]>([]);
    const [inactiveValues, setInactiveValues] = useState<Animated.Value[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const { tabBar: { state: {routes, index}, descriptors, navigation }, value, theme } = props;

    const tabWidth = width / routes.length;
    // 设置背景色
    const backgroundColor = theme || tabBarTheme.tabBarInactiveBackgroundColor;

    useEffect(() => {
        setValues(() => routes.map((route, index) => 
        new Animated.Value(index === 0 ? 1 : 0)));
        setInactiveValues(() => routes.map((route, index) => 
        new Animated.Value(index === 0 ? 0 : 1)));
        setActiveIndex(index);
    }, [])

    const onPress = (route: NavigationRoute<ParamListBase, string>, key: number) => () => {
        // 处理动画
        Animated.sequence([
            Animated.parallel(
                values.map(v => Animated.timing(v, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }))
            ),
            Animated.parallel(
                inactiveValues.map(v => Animated.timing(v, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                })),
            ),
            Animated.parallel([
                Animated.spring(value, {
                    toValue: tabWidth * key,
                    useNativeDriver: true,
                }),
                Animated.spring(values[key], {
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.spring(inactiveValues[key], {
                    toValue: 0,
                    useNativeDriver: true,
                })
            ]),
        ]).start();
        // 更新激活tabBar索引
        setActiveIndex(key);
        // 处理 navigation 事件
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (key !== activeIndex && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
        }
    }

    const onLongPress = (route: NavigationRoute<ParamListBase, string>) => () => {
        navigation.emit({
            type: 'tabLongPress',
            target: route.key,
        });
    }

    const processRoutesToElemData = (route: NavigationRoute<ParamListBase, string>, key: number) => {
        const { options } = descriptors[route.key]
        const { 
            title,
            tabBarLabel,
            tabBarIcon,
            tabBarActiveTintColor,
            tabBarInactiveTintColor,
            tabBarActiveBackgroundColor,
            tabBarInactiveBackgroundColor
        } = { ...tabBarTheme, ...options };

        const label = 
            tabBarLabel !== undefined
            ? tabBarLabel
            : title !== undefined
            ? title
            : route.name;
        
        const focused = key == activeIndex;
        const color = focused ? tabBarActiveTintColor : tabBarInactiveTintColor;
        const size = 24;

        const translateY = values[key]?.interpolate({
            inputRange: [0, 1],
            outputRange: [64, 0],
            extrapolate: "clamp",
        });
        const opacity = values[key]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
        });
        const inactivetranslateY = inactiveValues[key]?.interpolate({
            inputRange: [0, 1],
            outputRange: [64, 0],
            extrapolate: "clamp",
        });
        const inactiveOpacity = inactiveValues[key]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
        });
        
        return { label, tabBarIcon, focused, color, size, translateY, inactivetranslateY, opacity, inactiveOpacity };
    }

    return (
        <View style={styles.container}>
            {
                routes.map((route, key) => {
                    const {
                        label,
                        tabBarIcon,
                        focused,
                        color,
                        size,
                        translateY,
                        inactivetranslateY,
                        opacity,
                        inactiveOpacity
                    } = processRoutesToElemData(route, key);
                    
                    return (
                        <Fragment key={route.key} >
                            <TouchableWithoutFeedback onPress={onPress(route, key)} onLongPress={onLongPress(route)}>
                                <Animated.View
                                    style={[
                                        styles.tabBarContainer,
                                        {...{
                                            opacity: inactiveOpacity,
                                            transform: inactivetranslateY ? [{ translateY: inactivetranslateY }]: undefined,
                                        }}
                                    ]}
                                >
                                    {
                                        tabBarIcon?.({focused, color, size})
                                    }
                                    <Text style={{color}}>{label}</Text>
                                </Animated.View>
                            </TouchableWithoutFeedback>
                            <Animated.View
                                style={[styles.activeIconContainer,{
                                    left: tabWidth * key,
                                    width: tabWidth,
                                    ...{
                                        opacity,
                                        transform: translateY ? [{ translateY }]: undefined,
                                    }
                                }]}
                            >
                                <View style={{...styles.activeIcon, backgroundColor}}>
                                    {
                                        tabBarIcon?.({focused, color, size})
                                    }
                                </View>
                            </Animated.View>
                        </Fragment>
                    );
                })
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    tabBarContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: height,
    },
    activeIconContainer: {
        position: 'absolute',
        top: -12,
        justifyContent: "center",
        alignItems: "center",
    },
    activeIcon: {
        width: 54,
        height: 54,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    }
});