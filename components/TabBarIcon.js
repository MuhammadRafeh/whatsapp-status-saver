import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const TabBarIcon = props => {
    console.log(props)
    const translateX = useSharedValue(-4);
    const scale = useSharedValue(0);
    useEffect(() => {
            translateX.value = withSpring(-10)
            scale.value = withTiming(1, {duration: 1000})
    }, [])
    const style = useAnimatedStyle(() => (
        {
            transform: [
                { translateX: translateX.value }
            ]
        }
    ))
    const iconStyle = useAnimatedStyle(() => {
        // const scale = interpolate()
        return {
            transform: [
                {scale: scale.value}
            ]
        }
    });
    return (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Animated.View style={style}>
                <Text style={[{ color: props.color }]}>
                    {props.title}
                </Text>
            </Animated.View>
            <Animated.View style={iconStyle}>
                <Icon name={'md-add-circle'} color={props.color} />
            </Animated.View>
        </View>
    );
}
export default TabBarIcon;
