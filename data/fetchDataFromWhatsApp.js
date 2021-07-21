import writeExternalStoragePermission from "../permissions/writeExternalStorage";
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// await AsyncStorage.setItem('@directory', saveDirectory)

// var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
// // day hour  min  sec  msec
// if (OneDay > yourDate) {
//     // The yourDate time is less than 1 days from now

// }
// else if (OneDay < yourDate) {
//     // The yourDate time is more than 1 days from now
// }

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
    const promises = [];
    for (const directory of directories) {//directory = string
        try {
            const data = await RNFS.readDir(directory);
            // if (data.length >= 2) {
            //     data.forEach(file => {
            //         if (file.name.split('.')[1] != 'nomedia') {
            //             const OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
            //             if (OneDay > yourDate) {
            //                 // The yourDate time is less than 1 days from now

            //             }
            //         }
            //     })
            // }
            datas = [...data]
            saveDirectory = directory;
        } catch (err) {
            console.log(err);
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
            // console.log(data)

        } catch (err) {
            console.log(err.message, err.code);
        }
    } else {
        data = [...isComingFromSetupDirectory];
    }

    const images = [];
    const videos = [];
    let imgId = 0;
    let vidId = 0;
    data.forEach((obj) => {
        // console.log(new Date(obj.mtime))
        if (obj.isFile()) {
            // console.log(obj)
            if (obj.name.split('.')[1] != 'nomedia') {
                if (obj.name.split('.')[1] == 'jpg') {
                    images.push({
                        id: imgId++,
                        name: obj.name,
                        path: obj.path,
                        time: obj.mtime,
                        // size: obj.size,
                    });
                } else if (obj.name.split('.')[1] == 'mp4') {
                    videos.push({
                        id: vidId++,
                        name: obj.name,
                        path: obj.path,
                        time: obj.mtime,
                        // size: obj.size,
                    });
                }
            }
        }
    });

    const imgLatest = images.sort((a, b) => {
        const date1 = new Date(a.time);
        const date2 = new Date(b.time);

        return date2 - date1;
    });

    const vidLatest = videos.sort((a, b) => {
        // console.log(Date(a.time))
        const date1 = new Date(a.time);
        const date2 = new Date(b.time);

        return date2 - date1;
    });

    // console.log(vidLatest, imgLatest)
    // console.log(imgLatest)
    return { videos: [...vidLatest], images: [...imgLatest] }
};

export default fetchDataFromDirectory;
