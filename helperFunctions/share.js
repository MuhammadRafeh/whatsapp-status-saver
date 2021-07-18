import Share from 'react-native-share';
import button from '../sounds/playSoundFunc';

const share = source => {
    // await Share.share({ url: 'file//'+props.source })
    button.play((success) => {
        if (success) {
            button.stop();
        }
    });
    Share.open({
        url: 'file:///' + source
    })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            err && console.log(err);
        });
}

export default share;
