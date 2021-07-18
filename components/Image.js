import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import download from '../helperFunctions/download';
import share from '../helperFunctions/share';

const ImageComponent = props => {

    return (
        <View style={{ marginVertical: 1 }}>
            <Image source={{ uri: 'file:///' + props.source }} style={{ height: 400, width: '100%' }} resizeMode={'contain'} />
            <TouchableOpacity style={{ position: 'absolute', bottom: 110, right: 10, alignItems: 'center', justifyContent: 'center' }} onPress={share.bind(null, props.source)}>
                <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'rgba(0, 0, 0, .5)', borderRadius: 30, width: 60, height: 60 }}>
                    <Icon name={'ios-arrow-redo-outline'} size={40} color={'white'} />
                    <View style={{ width: '39%' }}>
                        <Text style={{ color: 'white', letterSpacing: 0.1, textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={1}>Share</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ position: 'absolute', bottom: 35, right: 10, alignItems: 'center', justifyContent: 'center' }} onPress={download.bind(null, props.source)}>
                <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'rgba(0, 0, 0, .5)', borderRadius: 30, width: 60, height: 60 }}>
                    <Icon name={'ios-download-outline'} size={40} color={'white'} />
                    <View style={{ width: '66%' }}>
                        <Text style={{ color: 'white', letterSpacing: 0.1, textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={1}>Download</Text>
                    </View>
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
// export default React.memo(ImageComponent, (prevProps, nextProps) => prevProps.source === nextProps.source);
export default ImageComponent;
