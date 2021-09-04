import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import PlayerVideo from '../components/VideoPlayer';
import { connect } from 'react-redux';
import EmptyScreenInfo from '../components/EmptyScreenInfo';

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
            this.setState({ focused: true })
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

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        try {
            this.setState({ viewableIndex: viewableItems[0]['index'] })
        } catch (err) {
        }
    }

    handleOnScroll(event) {
        //calculate screenIndex by contentOffset and screen width
        // console.log('currentScreenIndex', parseInt(event.nativeEvent.contentOffset.x / Dimensions.get('window').width));
    }

    render() {

        return <View
            onLayout={(e) => {
                const { height } = e.nativeEvent.layout;
                this.setState({videoHeight: height})
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
                    { useNativeDriver: true } // <-- Add this
                )}
                // onViewableItemsChanged={this.onViewableItemsChanged}
                contentContainerStyle={styles.scrollViewStyle}
                ref={ref => this.list = ref}
            // ListEmptyComponent={<EmptyScreenInfo />}
            >
                {
                    this.state.videosData.map((data) => {
                        return (
                            <PlayerVideo
                                key={data.id}
                                source={data.path}
                                refList={this.list}
                                height={this.videoHeight ? this.videoHeight : height - 35}
                                index={1}
                                isViewable={this.state.viewableIndex == 1 && this.state.focused ? true : false} />
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
    },
    scrollViewStyle: {
        flexGrow: 1,
        justifyContent: 'center'
    }
})
