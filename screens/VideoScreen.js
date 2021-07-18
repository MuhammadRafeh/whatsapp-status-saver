import React from 'react';
import { View, Text, StyleSheet, AppState, FlatList, Animated, Dimensions } from 'react-native';
import fetchDataFromDirectory from '../data/fetchDataFromWhatsApp';
import PlayerVideo from '../components/VideoPlayer';
import Image from '../components/Image';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class VideoScreen extends React.Component {
    state = {
        videosData: [], //[{id, name, path, time},...]
        appState: '',
        viewableIndex: 0, //-1 in order to stop all videos from play
        viewableIndexWas: -1, //when viewableIndex will be -1 then to keep track of that using viewableIndexWas.
        focused: true
    }

    // setViewableIndex = (index) => { 
    //     // setting viewableIndex because there is case for it, if video is playing and viewableIndex is false then we are setting it in VideoPlayer Comp.
    //     this.setState({viewableIndex: index})
    // }

    // fetchData = async () => {
    //     const data = await fetchDataFromDirectory('videos');
    //     this.setState({ pdfInfo: data.pdfInfo });
    // }

    static getDerivedStateFromProps(props, currentState) {
        console.log('asdasdasd')
        if (JSON.stringify(props.videosData) === JSON.stringify(currentState.videosData)) return null;

        if (props.videosData.length >= 0) {
            return {
                videosData: [...props.videosData]
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.navigation.isFocused())
        if (this.state.videosData.length > this.dataLength) { //We are seeing if we need to scroll to top or not
            this.dataLength = this.state.videosData.length;
       
            if (this.props.navigation.isFocused()) {
                // this.list.scrollToIndex({ animated: true, index: 0, viewPosition: 0 })
                // console.log(2323232323)
                this.list.scrollToOffset({ animated: true, offset: 0 });
            } else {
                this.setState({variableIndex: -1})
                this.isTheirAnyNeedToScrollToTop = true;
            }
        }
    }

    
    componentDidMount() {
        this.isTheirAnyNeedToScrollToTop = false;
        this.tabPressListenerBlur = this.props.navigation.addListener('blur', e => {
            this.setState({ viewableIndex: -1, viewableIndexWas: this.state.viewableIndex, focused: false })
        })
        this.tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
            if (this.isTheirAnyNeedToScrollToTop) {
                this.isTheirAnyNeedToScrollToTop = false;
                // this.list.scrollToIndex({ animated: true, index: 0, viewPosition: 0 })
                this.list.scrollToOffset({ animated: true, offset: 0 });
                this.setState({focused: true})
            } else {
                //when we focus from this we are running the video
                this.setState({ viewableIndex: this.state.viewableIndexWas, viewableIndexWas: -1, focused: true })
            }
            // console.log('asdasdasdasdas')
        })
        this.videoHeight = height;
        this.dataLength = 0;
        // this.fetchData();
    }

    componentWillUnmount() {
        this.tabPressListenerBlur();
        this.tabPressListenerFocus();
    }

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        // console.log("Visible items are", viewableItems);
        // console.log("Changed in this iteration", changed);
        // console.log('onViewableitems changed')
        try {
            this.setState({ viewableIndex: viewableItems[0]['index'] })
        } catch (err) {

        }
    }

    render() {
        // console.log('==========================', this.props.videoData)
        return <AnimatedFlatList
            onLayout={(e) => {
                const { height } = e.nativeEvent.layout;
                this.videoHeight = height;
            }}
            // onResponderRelease={e => {console.log(e.nativeEvent.pageY)}}
            // onResponderRelease={(e) => console.log(e.nativeEvent.)}
            // onScrollBeginDrag
            // snapToAlignment={'top'}
            // onMoveShouldSetResponderCapture={(e) => {e.nativeEvent.}}
            // decelerationRate={'fast'}
            decelerationRate={'fast'}
            scrollEventThrottle={16}
            // onScroll={(e) => console.log('+++++++++++++++++',Object.keys(e), e.nativeEvent)}
            // onScrollEndDrag={(e) => {
            //     // this.list.setNativeProps({ scrollEnabled: false })
            //     console.log(e.nativeEvent)
            //     if (e.nativeEvent.velocity.y > 0.1) {
            //         console.log('go to above')
            //         this.list.scrollToIndex({animated: true, index: this.state.viewableIndex - 1, viewPosition: 0})
            //     } else if (e.nativeEvent.velocity.y < -0.9){
            //         console.log('go to below')
            //         this.list.scrollToIndex({animated: true, index: this.state.viewableIndex + 1, viewPosition: 0})
            //     } 
            //     // if (e.nativeEvent.velocity.y < 0.1000 && e.nativeEvent.velocity.y >= 0) {
            //     //     this.list.scrollToIndex({animated: true, index: this.state.viewableIndex, viewPosition: 0})
            //     // }
            //     // else if (e.nativeEvent.velocity.y < -0.1000 && e.nativeEvent.velocity.y < 0) {
            //     //     this.list.scrollToIndex({animated: true, index: this.state.viewableIndex, viewPosition: 0})
            //     // }
            //     // this.list.setNativeProps({ scrollEnabled: true })
            //     console.log('h1')
            // }}
            // onScrollBeginDrag={(e) => {
            //     console.log(e.nativeEvent)
            //     // if (e.nativeEvent.velocity.y >= 0){
            //     //     this.list.scrollToIndex({ animating: true, index: [this.state.viewableIndex - 1] });
            //     // } else if (e.nativeEvent.velocity.y < 0) {
            //     //     this.list.scrollToIndex({ animating: true, index: [this.state.viewableIndex + 1] });
            //     // }
            //     // this.list._
            // }}
            viewabilityConfig={{
                // itemVisiblePercentThreshold: 90,
                viewAreaCoveragePercentThreshold: 60
            }}
            // extraData={this.state.viewableIndex}
            onViewableItemsChanged={this.onViewableItemsChanged}
            // scr
            contentContainerStyle={styles.screen}
            data={this.state.videosData}
            keyExtractor={item => item.id}
            ref={ref => this.list = ref}
            renderItem={({ item, index }) => {
                // console.log(index)
                return <PlayerVideo
                    source={item.path}
                    refList={this.list}
                    height={this.videoHeight}
                    index={index}
                    // setViewableIndex={this.setViewableIndex}
                    isViewable={this.state.viewableIndex  == index && this.state.focused ? true : false} />
            }}
            ListEmptyComponent={() => {
                return <View style={{ backgroundColor: '#111212', justifyContent: 'center', alignItems: 'center', height: height - 40 }}>
                    {
                        this.props.videosData.length == 0 && (
                            <>
                                <Text style={{ color: 'grey' }}>Which WhatsApp You are using? Set from settings.</Text>
                                <Text style={{ color: 'grey' }}>OR</Text>
                                <Text style={{ color: 'grey' }}>May be you have currently no status on your WhatsApp.</Text>
                            </>
                        )
                    }
                </View>
            }}
        />
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
        // flex: 1
    }
})
