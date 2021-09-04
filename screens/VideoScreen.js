import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import PlayerVideo from '../components/VideoPlayer';
import { connect } from 'react-redux';
// import EmptyScreenInfo from '../components/EmptyScreenInfo';

const { height } = Dimensions.get('window');

class VideoScreen extends React.Component {
    scrollY = new Animated.Value(0);

    state = {
        videosData: [], //[{id, name, path, time},...]
        viewableIndex: 0, //-1 in order to stop all videos from play
        viewableIndexWas: -1, //when viewableIndex will be -1 then to keep track of that using viewableIndexWas.
        focused: true,
        videoHeight: height
    }

    isTheirAnyNeedToScrollToTop = false;
    tabPressListenerBlur = this.props.navigation.addListener('blur', e => {
        this.setState({ viewableIndex: -1, viewableIndexWas: this.state.viewableIndex, focused: false })
    })
    tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
        if (this.isTheirAnyNeedToScrollToTop) {
            this.isTheirAnyNeedToScrollToTop = false;
            this.list.scrollTo({ animated: true, x: 0, y: 0 });
            this.setState({ focused: true, viewableIndex: 0 })
        } else {
            //when we focus from this we are running the video
            this.setState({ viewableIndex: this.state.viewableIndexWas, viewableIndexWas: -1, focused: true })
        }
    })
    dataLength = 0;

    static getDerivedStateFromProps(props, currentState) {
        if (JSON.stringify(props.videosData) === JSON.stringify(currentState.videosData)) return null;
        return {
            videosData: [...props.videosData]
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.videosData.length > this.dataLength) { //We are seeing if we need to scroll to top or not
            this.dataLength = this.state.videosData.length;

            if (this.props.navigation.isFocused()) {
                this.list.scrollTo({ animated: true, x: 0, y: 0 });
            } else {
                this.isTheirAnyNeedToScrollToTop = true;
            }
        }
    }

    componentWillUnmount() {
        this.tabPressListenerBlur();
        this.tabPressListenerFocus();
    }

    moveToNext = (index) => {
        this.setState({ viewableIndex: index + 1 })
        // const nextItem = Number.parseInt(JSON.stringify(this.scrollY)) + this.state.videoHeight
        const nextItem = (index * this.state.videoHeight) + this.state.videoHeight
        try {
            this.list.scrollTo({ animated: true, y: nextItem })
        } catch (err) {
        }
        this.scrollY.setValue(nextItem)
    }


    render() {

        return <View
            onLayout={(e) => {
                const { height } = e.nativeEvent.layout;
                this.setState({ videoHeight: height })
            }}
            style={styles.screen}
        >
            {console.log(this.state.videoHeight, this.scrollY)}
            <Animated.ScrollView
                decelerationRate={'fast'}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: { y: this.scrollY }
                            }
                        }
                    ],
                    { useNativeDriver: true }
                )}
                // scrollEnabled={false}
                ref={ref => this.list = ref}
            >
                {
                    this.state.videosData.map((data, index) => {
                        console.log("id", data.id)
                        return (
                            <PlayerVideo
                                key={index}
                                moveToNext={this.moveToNext}
                                source={data.path}
                                height={this.state.videoHeight ? this.state.videoHeight : height - 35}
                                index={index}
                                isViewable={this.state.viewableIndex == index && this.state.focused ? true : false} />
                        )
                    })
                }
            </Animated.ScrollView>
        </View>
    }
}

const mapStateToProps = state => {
    return {
        videosData: state.media.videos //[{id, name, path, time},...]
    }
}

export default connect(mapStateToProps, null)(VideoScreen);

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#111212',
        flex: 1
    }
})
