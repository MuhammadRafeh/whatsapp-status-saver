import React from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import EmptyFolder from '../assets/search.svg';

const { height } = Dimensions.get('window');

const EmptyScreenInfo = () => {
    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 40 }}>
                <EmptyFolder width={200} height={height / 4.5} />
            </View>
            <View style={styles.width}>
                <Text style={styles.infoLines} numberOfLines={1} adjustsFontSizeToFit={true}>I Hope You Have Selected Your WhatsApp From Settings.</Text>
            </View>
            <View style={{ marginBottom: 1 }}>
                <Text style={styles.or}>OR</Text>
            </View>
            <View style={styles.width}>
                <Text style={styles.infoLines} numberOfLines={1} adjustsFontSizeToFit={true}>May be you have currently no status on your WhatsApp.</Text>
            </View>
        </View>
    );
}

export default EmptyScreenInfo;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoLines: {
        color: 'grey',
        fontFamily: 'verdana',
        textAlign: 'center'
    },
    width: {
        width: '80%',
        // backgroundColor: 'green'
    },
    or: {
        color: 'grey',
        fontStyle: 'italic',
        borderColor: 'grey',
        borderBottomWidth: 1
    }
});
