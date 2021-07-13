import React from 'react';
import { TouchableOpacity } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraRoll from "@react-native-community/cameraroll";

const PlayerVideo = props => {
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
                pauseOnPress={true}
                // navigator={this.props.navigator}
            />
            <TouchableOpacity style={{ position: 'absolute', bottom: 100, right: 20 }} onPress={() => {
                CameraRoll.save('/storage/emulated/0/WhatsApp/Media/.Statuses/0e301a49836543398709e4c592abed87.mp4', { type: 'auto' })
            }}>
                {/* <Button title={'hi'} /> */}
                <Icon name={'download'} size={40} color={'white'} />
            </TouchableOpacity>
        </>
    )
}

export default PlayerVideo;
