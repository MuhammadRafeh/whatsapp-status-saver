import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const TabBarIcon = props => {
    const translateX = useSharedValue(-4);

    // useAnimatedReaction(() => props.isAnimate.value, (newVal) => {
    //     if (newVal){
    //         translateX.value = -8
    //     } else {
    //         translateX.value = 0
    //     }
    // })
    // Animated.timing(translateX, { toValue: -10, duration: 1000 }).start()

    // useEffect(() => {
    //     translateX.value = withSpring(-20)
    // },[])

    useEffect(() => {
        translateX.value = withSpring(-10)

    })
    console.log(2323232323232323)

    const style = useAnimatedStyle(() => (
        {
            transform: [
                { translateX: translateX.value }
            ]
        }
    ))



    return (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Animated.View style={style}>
                <Text style={[{ color: props.color }]}>
                    VIDEOS
                </Text>
            </Animated.View>
            <View>
                <Icon name={'md-add-circle'} color={props.color} />
            </View>
        </View>
    );
}

export default TabBarIcon;

const styles = StyleSheet.create({

})
