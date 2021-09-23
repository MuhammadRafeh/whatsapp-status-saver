import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const TabBarIcon = props => {
    const translateX = useSharedValue(-4);
    const scale = useSharedValue(0);
    useEffect(() => {
            translateX.value = withSpring(-10)
            scale.value = withTiming(1, {duration: 600})
    }, [])
    const style = useAnimatedStyle(() => (
        { transform: [ { translateX: translateX.value } ] }
    ))
    const iconStyle = useAnimatedStyle(() => {
        return { transform: [ {scale: scale.value} ] }
    });
    return (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Animated.View style={style}>
                <Text style={[{ color: props.color }]}>
                    {props.title}
                </Text>
            </Animated.View>
            <Animated.View style={iconStyle}>
                <Image source={require('../assets/dot.png')} style={{tintColor: props.color, width: 10, height: 10}} resizeMode={'contain'} />
            </Animated.View>
        </View>
    );
}
export default TabBarIcon;
