import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import download from '../helperFunctions/download';
import share from '../helperFunctions/share';

const ImageComponent = React.memo((props) => {

    return (
        <View style={{ marginVertical: 1 }}>
            <Image source={{ uri: 'file:///' + props.source }} style={styles.imageStyle} resizeMode={'contain'} />
            <TouchableOpacity style={styles.containerOutset} onPress={share.bind(null, props.source)}>
                <View style={styles.iconContainer}>
                    <Icon name={'ios-arrow-redo-outline'} size={40} color={'white'} />
                    <View style={{ width: '39%' }}>
                        <Text style={styles.actions} adjustsFontSizeToFit={true} numberOfLines={1}>Share</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.containerOutset, { bottom: 35 }]} onPress={download.bind(null, props.source)}>
                <View style={styles.iconContainer}>
                    <Icon name={'ios-download-outline'} size={40} color={'white'} />
                    <View style={{ width: '66%' }}>
                        <Text style={styles.actions} adjustsFontSizeToFit={true} numberOfLines={1}>Download</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
})

const styles = StyleSheet.create({
    actions: {
        color: 'white',
        letterSpacing: 0.1,
        textAlign: 'center'
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        borderRadius: 30,
        width: 60,
        height: 60
    },
    containerOutset: {
        position: 'absolute',
        bottom: 110,
        right: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        height: 400,
        width: '100%'
    }
})

export default ImageComponent;
