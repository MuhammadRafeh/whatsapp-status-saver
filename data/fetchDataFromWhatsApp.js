import writeExternalStoragePermission from "../permissions/writeExternalStorage";
import * as RNFS from 'react-native-fs';

const fetchDataFromDirectory = async () => {
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
                pdfInfo.push({
                    id: id++,
                    name: obj.name,
                    path: obj.path,
                    // size: obj.size,
                    // time: obj.mtime,
                });
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
