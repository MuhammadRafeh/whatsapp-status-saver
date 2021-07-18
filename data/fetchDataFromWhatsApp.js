import writeExternalStoragePermission from "../permissions/writeExternalStorage";
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchDataFromDirectory = async () => {
    const isGranted = await writeExternalStoragePermission();
    if (!isGranted) {
        return;
    }
    
    try {
        // console.log(RNFS.ExternalStorageDirectoryPath)
        let dir = '/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses';
        const value = await AsyncStorage.getItem('@whichwhatsapp');
        if (value !== null) {
            if (value == 'whatsapp'){
                dir = '/storage/emulated/0/WhatsApp/Media/.Statuses';
            }
            else if (value == 'Ywhatsapp'){
                dir = '/storage/emulated/0/YoWhatsApp/Media/.Statuses';
            }
            // else if (value == 'Bwhatsapp'){

            // }
        }
        // if (Wtype == 'whatsapp'){
        //     dir
        // }
        const data = await RNFS.readDir(
            // '/storage/emulated/0/WhatsApp/Media/.Statuses',
            dir
        );
        const images = [];
        const videos = [];
        let imgId = 0;
        let vidId = 0;
        data.forEach((obj) => {
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
            const date1 = new Date(a.time);
            const date2 = new Date(b.time);

            return date2 - date1;
        });

        // console.log(vidLatest, imgLatest)
        // console.log(imgLatest)
        return { videos: [...vidLatest], images: [...imgLatest] }
    } catch (err) {
        console.log(err.message, err.code);
    }
};

export default fetchDataFromDirectory;
