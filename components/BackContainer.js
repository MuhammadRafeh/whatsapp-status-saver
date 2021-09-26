import React from 'react';
import { Image } from 'react-native';
const BackContainer = React.memo(() => {
    return (
        <Image
            source={require('../assets/left.png')}
            style={{ tintColor: 'white', width: 20, marginLeft: 10 }}
            resizeMode="contain"
        />
    );
})
export default BackContainer;
export const conStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: 40,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    paddingLeft: 7
}