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
    const directoryDatas = {};
    let doProcess = true
    let datas = [];
    let saveDirectory = '';
    for (const directory of directories) {//directory = string
        try {
            const data = await RNFS.readDir(directory);
            datas = [...data]
            saveDirectory = directory;
            directoryDatas[directory] = datas;
        } catch (err) {
            console.log(23)
            doProcess = false;
        }
    }
    if (doProcess) {
        // if obj.name.split('.')[1] != 'nomedia'
        const list = Object.keys(directoryDatas);
        const dir1 = directoryDatas[list[0]][0].name.split('.')[1];
        const dir2 = directoryDatas[list[1]][0].name.split('.')[1];
        if (dir1 == 'nomedia' && dir2 != 'nomedia') {
            RNFS.unlink(list[1])
                .catch((err) => {
                });
        } else if (dir1 != 'nomedia' && dir2 == 'nomedia'){
            RNFS.unlink(list[0])
            .catch((err) => {
            });
        } else if (directoryDatas[list[0]].length >= 1 && directoryDatas[list[1]].length >= 1) {
            for (var i = 0; i < 2; i++) {
                directoryDatas[list[i]].forEach((obj) => {
                    if (obj.name.split('.')[1] == 'nomedia') {
                        RNFS.unlink(directoryDatas[list[i]][0].path)
                            .catch((err) => {
                            });
                        return;
                    }
                })
            }
        } else if (directoryDatas[list[0]].length == 0 || directoryDatas[list[1]].length == 0) {
            if (directoryDatas[list[0]].length == 0) {
                RNFS.unlink(list[0])
                    .catch((err) => {
                    });
            } else {
                RNFS.unlink(list[1])
                    .catch((err) => {
                    });
            }
        }
    }

    await AsyncStorage.setItem('@directory', saveDirectory)
    if (datas.length == 0) {
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

        } catch (err) { }
    } else {
        data = [...isComingFromSetupDirectory];
    }
    if (data.length == 0) return { videos: [], images: [] }
    const images = [];
    const videos = [];
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
