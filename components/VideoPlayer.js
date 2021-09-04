import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video'
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/Ionicons';
import Buttons from './Buttons';

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
        const { width, height } = Dimensions.get('window');
        return (
            // <View style={{position: 'relative', height: this.props.height }}>

                <View style={{ flex: 1, top: this.props.index * this.props.height }}>
                    {console.log(this.props.height, 'asdasd')}
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
                    <View style={[styles.controls, {top: this.props.height - 48}]}>
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
                    <Buttons source={this.props.source} shareTop={this.props.height - 173} downTop={this.props.height - 100} />
                </View>
            // </View>
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
