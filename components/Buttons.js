import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import download from '../helperFunctions/download';
import share from '../helperFunctions/share';
const Buttons = React.memo((props) => {
    return (
        <>
            <TouchableOpacity style={[styles.containerOutset, { bottom: props.share ? props.share : 110 }]} onPress={share.bind(null, props.source)}>
                <View style={styles.iconContainer}>
                    <Image source={require('../assets/share.png')} resizeMode={'contain'} style={{ width: 40, height: 40, tintColor: 'white' }} />
                    <View style={{ width: '39%' }}>
                        <Text style={styles.actions} adjustsFontSizeToFit={true} numberOfLines={1}>Share</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.containerOutset, { bottom: props.downL ? props.downL : 35 }]} onPress={download.bind(null, props.source)}>
                <View style={styles.iconContainer}>
                    <Image source={require('../assets/download.png')} resizeMode={'contain'} style={{ width: 40, height: 40, tintColor: 'white', marginTop: 2 }} />
                    <View style={{ width: '66%' }}>
                        <Text style={styles.actions} adjustsFontSizeToFit={true} numberOfLines={1}>Download</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
})
export default Buttons;
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
    }
})
