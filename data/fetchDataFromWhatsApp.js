import writeExternalStoragePermission from "../permissions/writeExternalStorage";
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sorting = (arr) => {
    arr.sort(function (a, b) { //Latest Sorting
        if (new Date(a.time) > new Date(b.time)) {
            return -1;
        }
        if (new Date(b.time) > new Date(a.time)) {
            return 1;
        }
        return 0;
    });
}

// Call this if user opens app for first time and set choose other directory from options!
export const directorySetup = async (type) => {// whatsapp, Bwhatsapp, Ywhatsapp
    const isGranted = await writeExternalStoragePermission();
    if (!isGranted) {
        return;
    }
    const firstWhatsAppDirectory = `${RNFS.ExternalStorageDirectoryPath}/WhatsApp/Media/.Statuses`;
    const secondWhatsAppDirectory = dir = `${RNFS.ExternalStorageDirectoryPath}/Android/media/com.whatsapp/WhatsApp/Media/.Statuses`;
    const firstBWhatsAppDirectory = `${RNFS.ExternalStorageDirectoryPath}/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses`;
    const secondBWhatsAppDirectory = `${RNFS.ExternalStorageDirectoryPath}/WhatsApp Business/Media/.Statuses`;
    const firstYoWhatsAppDirectory = `${RNFS.ExternalStorageDirectoryPath}/YoWhatsApp/Media/.Statuses`;
    const secondYoWhatsAppDirectory = `${RNFS.ExternalStorageDirectoryPath}/Android/media/com.yowhatsapp/YoWhatsApp/Media/.Statuses`;

    const directories = []; //string
    let dir = `${RNFS.ExternalStorageDirectoryPath}/WhatsApp/Media/.Statuses`;
    const value = await AsyncStorage.getItem('@whichwhatsapp');
    if (value !== null) {
        if (value == 'Bwhatsapp') {
            directories.push(firstBWhatsAppDirectory)
            directories.push(secondBWhatsAppDirectory)
        } else if (value == 'Ywhatsapp') {
            directories.push(firstYoWhatsAppDirectory)
            directories.push(secondYoWhatsAppDirectory)
        } else if (value == 'whatsapp') {
            directories.push(firstWhatsAppDirectory)
            directories.push(secondWhatsAppDirectory)
        }
    } else {
        // if value is null then we are taking whatsapp as default |value = whatsapp|
        directories.push(firstWhatsAppDirectory)
        directories.push(secondWhatsAppDirectory)
    }

    let datas = [];
    let saveDirectory = '';
    for (const directory of directories) {//directory = string
        try {
            const data = await RNFS.readDir(directory);
            datas = [...data]
            saveDirectory = directory;
        } catch (err) {
        }
    }
    await AsyncStorage.setItem('@directory', saveDirectory)
    if (datas.length == 0){
        return { videos: [], images: [] }
    }
    return await fetchDataFromDirectory(datas);
}

const fetchDataFromDirectory = async (isComingFromSetupDirectory = false) => {
    const isGranted = await writeExternalStoragePermission();
    if (!isGranted) {
        return;
    }

    let data = [];

    if (!isComingFromSetupDirectory) {
        // if it's not called by another function
        try {
            const dir = await AsyncStorage.getItem('@directory');
            if (dir !== null) {
                const dirData = await RNFS.readDir(dir);
                data = [...dirData];
            }

        } catch (err) {}
    } else {
        data = [...isComingFromSetupDirectory];
    }
    if (data.length == 0) return { videos: [], images: [] }
    const images = [];
    const videos = [];
    let imgId = 0;
    let vidId = 0;
    data.forEach((obj) => {
        if (obj.isFile()) {
            if (obj.name.split('.')[1] != 'nomedia') {
                if (obj.name.split('.')[1] == 'jpg') {
                    images.push({
                        name: obj.name,
                        path: obj.path,
                        time: obj.mtime,
                    });
                } else if (obj.name.split('.')[1] == 'mp4') {
                    videos.push({
                        name: obj.name,
                        path: obj.path,
                        time: obj.mtime,
                    });
                }
            }
        }
    });
    sorting(images)
    sorting(videos)
    return { videos, images }
};

export default fetchDataFromDirectory;
