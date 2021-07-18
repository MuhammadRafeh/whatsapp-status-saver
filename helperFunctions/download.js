import button from "../sounds/playSoundFunc";
import CameraRoll from "@react-native-community/cameraroll";

const download = source => {
    button.play((success) => {
        if (success) {
            button.stop();
        }
    });

    CameraRoll.save(source, { type: 'auto' })
}

export default download;
