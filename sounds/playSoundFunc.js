import Sound from 'react-native-sound'

const playSound = async () => {
    console.log('hasdasds')
    var button = new Sound('button.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + button.getDuration() + 'number of channels: ' + button.getNumberOfChannels());
    
        // Play the sound with an onEnd callback
        button.setVolume(1);
        button.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
        });
    });
}

export default playSound;
