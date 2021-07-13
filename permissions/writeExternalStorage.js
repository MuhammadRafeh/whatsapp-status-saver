import { PermissionsAndroid } from 'react-native';

const writeExternalStoragePermission = async () => {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
    } else {
        return false;
    }
}

export default writeExternalStoragePermission;
