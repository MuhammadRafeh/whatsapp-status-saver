import writeExternalStoragePermission from "../permissions/writeExternalStorage";
import * as RNFS from 'react-native-fs';

const fetchDataFromDirectory = async (type) => {
    const isGranted = await writeExternalStoragePermission();
    if (!isGranted) {
        return;
    }
    try {
        // console.log(RNFS.ExternalStorageDirectoryPath)
        const data = await RNFS.readDir(
            // '/storage/emulated/0/WhatsApp/Media/.Statuses',
            '/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
        );
        const pdfInfo = [];
        let id = 0;
        data.forEach((obj) => {
            if (obj.isFile()) {
                console.log(obj)
                if (obj.name.split('.')[1] != 'nomedia') {
                    if (type == 'images' && obj.name.split('.')[1] == 'jpg') {
                        pdfInfo.push({
                            id: id++,
                            name: obj.name,
                            path: obj.path,
                            time: obj.mtime,
                            // size: obj.size,
                        });
                    } else if (type == 'videos' && obj.name.split('.')[1] == 'mp4') {
                        pdfInfo.push({
                            id: id++,
                            name: obj.name,
                            path: obj.path,
                            time: obj.mtime,
                            // size: obj.size,
                        });
                    }
                }
            }
        });

        const latest = pdfInfo.sort((a, b) => {
            const date1 = new Date(a.time);
            const date2 = new Date(b.time);

            return date2 - date1;
        });

        return { pdfInfo: [...latest] }
    } catch (err) {
        console.log(err.message, err.code);
    }
};

export default fetchDataFromDirectory;
