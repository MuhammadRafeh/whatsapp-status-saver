import Share from 'react-native-share';
import button from '../sounds/playSoundFunc';

const share = source => {
    button.play((success) => {
        if (success) {
            button.stop();
        }
    });
    Share.open({
        url: 'file:///' + source
    })
        .then((res) => {
        })
        .catch((err) => {
        });
}

export default share;
