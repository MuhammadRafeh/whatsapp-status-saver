import button from "../sounds/playSoundFunc";
import CameraRoll from "@react-native-community/cameraroll";
import Snackbar from "react-native-snackbar";
const download = source => {
    button.play((success) => {
        if (success) {
            button.stop();
        }
    });
    CameraRoll.save(source, { type: 'auto' })
    Snackbar.show({
        text: 'Saved to Gallery!',
        duration: Snackbar.LENGTH_SHORT,
    });
}
export default download;