import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import PlayerVideo from '../components/VideoPlayer';
import { connect } from 'react-redux';
// import EmptyScreenInfo from '../components/EmptyScreenInfo';

const { height } = Dimensions.get('window');

class VideoScreen extends React.Component {
    // scrollY = new Animated.Value(0)

    state = {
        videosData: [], //[{id, name, path, time},...]
        viewableIndex: 0, //-1 in order to stop all videos from play
        viewableIndexWas: -1, //when viewableIndex will be -1 then to keep track of that using viewableIndexWas.
        focused: true,
        videoHeight: height
    }

    isTheirAnyNeedToScrollToTop = false;
    tabPressListenerBlur = this.props.navigation.addListener('blur', e => {
        console.log('run')
        this.setState({ viewableIndex: -1, viewableIndexWas: this.state.viewableIndex, focused: false })
    })
    tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
        if (this.isTheirAnyNeedToScrollToTop) {
            this.isTheirAnyNeedToScrollToTop = false;
            this.list.scrollTo({ animated: true, x: 0, y: 0 });
            this.setState({ focused: true, viewableIndex: 0 })
        } else if (this.state.viewableIndexWas != -1) { //if it's -1 means that it's running on initial render
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
        // this.scrollY = nextItem
    }


    render() {

        return <View
            onLayout={(e) => {
                const { height } = e.nativeEvent.layout;
                this.setState({ videoHeight: height })
            }}
            style={styles.screen}
        >
            {console.log('index', this.state.viewableIndex)}
            <Animated.ScrollView
                decelerationRate={'fast'}
                scrollEventThrottle={16}
                // this.state = e.nativeEvent.contentOffset.y;
                // e.nativeEvent.contentOffset.y / this.state.videoHeight
                onScroll={(e) => {
                    const offsetY = e.nativeEvent.contentOffset.y;

                    if (Math.round(offsetY / this.state.videoHeight) != this.state.viewableIndex) {
                        console.log(2323232)
                        this.setState({viewableIndex: Math.round(offsetY / this.state.videoHeight)})
                    }
                    // console.log('Videos Height', offsetY / this.state.videoHeight)
                }}
                // onScrollEndDrag={(e) => {
                //     // console.log('velocity', e.nativeEvent.velocity)
                //     const velocityY = e.nativeEvent.velocity.y
                //     const offsetY = e.nativeEvent.contentOffset.y
                //     if (velocityY > 0) { //going down
                //         console.log('asdad==========================')
                //         this.list.scrollTo({animated: false, y: Math.floor(offsetY/this.state.videoHeight)})
                //     } else if (velocityY < 0) { //going upward
                        
                //     }
                // }}
                // scrollEnabled={false}
                ref={ref => this.list = ref}
            >
                {
                    this.state.videosData.map((data, index) => {
                        // console.log("id", data.id, index)
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
