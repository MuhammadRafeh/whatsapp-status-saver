import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native';
import Video from 'react-native-video'
import ProgressBar from 'react-native-progress/Bar';
import Buttons from './Buttons';

function secondsToTime(time) {
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}

class PlayerVideo extends React.PureComponent {
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
        this.props.moveToNext(this.props.index)
        this.setState({
            paused: true
        })
        this.player.seek(0);
    }

    handleProgress = (progress) => {
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
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                        <Video
                            paused={this.state.paused}
                            source={{ uri: this.props.source }}
                            style={{ width: '100%', height: this.props.height }}
                            resizeMode={'contain'}
                            onLoad={this.handleLoad}
                            onProgress={this.handleProgress}
                            onEnd={this.handleEnd}
                            ref={ref => this.player = ref}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={[styles.controls, { top: this.props.height - 48 }]}>
                    <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                        <Image source={!this.state.paused ? require('../assets/pause.png') : require('../assets/play.png')} style={{ tintColor: 'white', width: 25, height: 25 }} />
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
                <Buttons source={this.props.source} share={140} downL={70} />
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

export default PlayerVideo;
