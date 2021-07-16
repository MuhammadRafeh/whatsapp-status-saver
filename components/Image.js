import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraRoll from "@react-native-community/cameraroll";

// const { width, height } = Dimensions.get('window');

const ImageComponent = props => {

    return (
        <View style={{ marginVertical: 1 }}>
            <Image source={{ uri: 'file:///' + props.source }} style={{ height: 400, width: '100%' }} resizeMode={'cover'} />
            <TouchableOpacity style={{ position: 'absolute', bottom: 48, right: 38 }} onPress={() => {
                CameraRoll.save(props.source, { type: 'auto' })
            }}>
                <View style={{backgroundColor: 'rgba(0, 0, 0, .5)'}}>
                    <Icon name={'download'} size={40} color={'white'} />
                </View>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }
})

// Only render when props changes
export default React.memo(ImageComponent, (prevProps, nextProps) => prevProps.source === nextProps.source);
