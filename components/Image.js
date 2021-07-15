import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraRoll from "@react-native-community/cameraroll";

const { width, height } = Dimensions.get('window');

const ImageComponent = props => {
    // console.log(props.source)
    return (
        <View style={{ height }}>
            <Image source={{uri: props.source}} style={{height, width: '100%'}} resizeMode={'contain'} />
            {/* <TouchableOpacity style={{ position: 'absolute', bottom: 100, right: 20 }} onPress={() => {
                CameraRoll.save(props.source, { type: 'auto' })
            }}>
                <Icon name={'download'} size={40} color={'white'} />
            </TouchableOpacity> */}
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
