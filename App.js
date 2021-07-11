import React from 'react';
import { Text, View, StyleSheet, PermissionsAndroid, Button, TouchableOpacity } from 'react-native';
import * as RNFS from 'react-native-fs';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraRoll from "@react-native-community/cameraroll";

const getPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('grantedyeah')
    return true;
  } else {
    return false;
  }
}



class App extends React.Component {
  state = {
    pdfInfo: []
  }


  fetchDataFromDirectory = async () => {
    const isGranted = await getPermission();
    console.log(123)
    if (!isGranted) {
      return;
    }
    try {
      // console.log(RNFS.ExternalStorageDirectoryPath)
      const data = await RNFS.readDir(
        '/storage/emulated/0/WhatsApp/Media/.Statuses',
      );
      const pdfInfo = [];
      console.log('asdasdasd', data)
      data.forEach((obj) => {
        if (obj.isFile()) {
          console.log(obj)
          pdfInfo.push({
            name: obj.name,
            path: obj.path,
            size: obj.size,
            time: obj.mtime,
            id: this.id++,
          });
        }
      });

      const latest = pdfInfo.sort((a, b) => {
        const date1 = new Date(a.time);
        const date2 = new Date(b.time);

        return date2 - date1;
      });

      this.setState({ pdfInfo: [...latest] });
    } catch (err) {
      console.log(err.message, err.code);
    }
  };

  componentDidMount() {
    this.fetchDataFromDirectory()
  }

  render() {
    console.log(this.state.pdfInfo)
    return (
      // <StatusSaver />
      // <Video source={{ uri: "/storage/emulated/0/WhatsApp/Media/.Statuses/0e301a49836543398709e4c592abed87.mp4" }}   // Can be a URL or a local file.
      //   ref={(ref) => {
      //     this.player = ref
      //   }}                                      // Store reference
      //   onBuffer={this.onBuffer}                // Callback when remote video is buffering
      //   onError={this.videoError}               // Callback when video cannot be loaded
      //   style={styles.backgroundVideo} />
      <>
        <VideoPlayer
          source={{ uri: '/storage/emulated/0/WhatsApp/Media/.Statuses/0e301a49836543398709e4c592abed87.mp4' }}
          navigator={this.props.navigator}
        />
        <TouchableOpacity style={{position: 'absolute', bottom: 100, right: 20}} onPress={() => {
          CameraRoll.save('/storage/emulated/0/WhatsApp/Media/.Statuses/0e301a49836543398709e4c592abed87.mp4', { type: 'auto' })
        }}>
          {/* <Button title={'hi'} /> */}
          <Icon name={'download'} size={40} color={'white'} />
        </TouchableOpacity>
      </>
    )
  }
}

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
})
