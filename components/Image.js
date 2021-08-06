import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Buttons from './Buttons';

const ImageComponent = React.memo((props) => {
    return (
        <View style={{ marginVertical: 1 }}>
            <Image source={{ uri: 'file:///' + props.source }} style={styles.imageStyle} resizeMode={'contain'} />
            <Buttons source={props.source} />
        </View>
    )
})

const styles = StyleSheet.create({
    imageStyle: {
        height: 400,
        width: '100%'
    }
})

export default ImageComponent;
