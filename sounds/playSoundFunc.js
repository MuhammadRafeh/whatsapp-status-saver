import Sound from 'react-native-sound'

var button = new Sound('button.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        return;
    }
});

button.setVolume(1);

export default button;
