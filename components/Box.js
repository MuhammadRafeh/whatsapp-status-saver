import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const Box = props => {
    return (
        <View style={styles.Box}>
            <TouchableOpacity
                onPress={props?.handlePress?.bind(null, props.index)}
            >
                <Image
                    source={{uri: 'file:///' + props.source,
                    height: '100%',
                    width: '100%'}}
                    resizeMode={'cover'}
                />
            </TouchableOpacity>
        </View>
    );
}

export default Box;

const styles = StyleSheet.create({
    Box: {
        width: width/2,
        height: height/3.9,
    }
});
