import Sound from 'react-native-sound'

var button = new Sound('button.mp3', Sound.MAIN_BUNDLE);

button.setVolume(1);

export default button;
