import Sound from 'react-native-sound'

var button = new Sound('button.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

button.setVolume(1);

export default button;
