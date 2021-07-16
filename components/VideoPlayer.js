import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video'
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraRoll from "@react-native-community/cameraroll";
import Share from 'react-native-share';

const { width, height } = Dimensions.get('window');

function secondsToTime(time) {
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}

class PlayerVideo extends React.Component {
    state = {
        paused: true,
        progress: 0,
        duration: 0,
        isViewable: true
    }

    handleMainButtonTouch = () => {

        if (this.state.progress >= 1) {
            this.player.seek(0);
        }
        this.setState(state => {
            return {
                paused: !state.paused
            }
        })
    }

    handleProgressPress = (e) => {
        const position = e.nativeEvent.locationX;
        const progress = (position / 250) * this.state.duration;
        this.player.seek(progress);
        this.setState({
            paused: false
        })
    }

    static getDerivedStateFromProps(props, currentState) {
        if (props.isViewable && currentState.isViewable) {
            return {
                paused: false,
                isViewable: false
            }
        } else if (!props.isViewable && !currentState.isViewable) {
            return {
                paused: true,
                isViewable: true
            }
        }
        return null;
    }

    handleEnd = () => {
        this.setState({
            paused: true
        })
        this.player.seek(0);
        try {
            this.props.refList.scrollToIndex({ animated: true, index: this.props.index + 1, viewPosition: 0 })
        } catch (err) {

        }
    }

    handleProgress = (progress) => {
        // console.log(progress)
        this.setState({
            progress: progress.currentTime / this.state.duration
        })
    }

    handleLoad = (meta) => {
        this.setState({
            duration: meta.duration
        })
    }

    render() {
        console.log('========>>>>>>>>>>.', this.props.isViewable, this.props.index)
        const { width, height } = Dimensions.get('window');
        // const height = width * .5625;
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                        <Video
                            paused={this.state.paused}
                            source={{ uri: this.props.source }}
                            style={{ width: '100%', height }}
                            resizeMode={'contain'}
                            onLoad={this.handleLoad}
                            onProgress={this.handleProgress}
                            onEnd={this.handleEnd}
                            ref={ref => this.player = ref}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.controls}>
                    <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                        <Icon name={!this.state.paused ? 'pause' : 'play'} size={30} color={'#FFF'} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.handleProgressPress}>
                        <View>
                            <ProgressBar
                                progress={this.state.progress}
                                color="#FFF"
                                unfilledColor="rgba(255, 255, 255, .5)"
                                borderColor="#FFF"
                                width={250}
                                height={20}

                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={styles.duration}>
                        {secondsToTime(Math.floor(this.state.progress * this.state.duration))}
                    </Text>
                </View>
                
                <TouchableOpacity style={{ position: 'absolute', bottom: 140, right: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                    // await Share.share({ url: 'file//'+this.props.source })
                    Share.open({
                        url: 'file:///' + this.props.source
                    })
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            err && console.log(err);
                        });
                }}>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'rgba(0, 0, 0, .5)', borderRadius: 30, width: 60, height: 60 }}>
                        <Icon name={'ios-arrow-redo-outline'} size={40} color={'white'} />
                        <View style={{ width: '39%' }}>
                            <Text style={{ color: 'white', letterSpacing: 0.1, textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={1}>Share</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ position: 'absolute', bottom: 70, right: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                    CameraRoll.save(this.props.source, { type: 'auto' })
                }}>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'rgba(0, 0, 0, .5)', borderRadius: 30, width: 60, height: 60 }}>
                        <Icon name={'ios-download-outline'} size={40} color={'white'} />
                        <View style={{ width: '66%' }}>
                            <Text style={{ color: 'white', letterSpacing: 0.1, textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={1}>Download</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: 48,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    mainButton: {
        marginRight: 15
    },
    duration: {
        color: "#FFF",
        marginLeft: 15
    }
})

// Only render when props changes
// export default React.memo(PlayerVideo, (prevProps, nextProps) => prevProps.isViewable === nextProps.isViewable);
export default PlayerVideo;
