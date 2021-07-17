import React from 'react';
import { View, Text, StyleSheet, AppState, FlatList, Animated, Dimensions } from 'react-native';
import fetchDataFromDirectory from '../data/fetchDataFromWhatsApp';
import PlayerVideo from '../components/VideoPlayer';
import Image from '../components/Image';

const { width, height } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class VideoScreen extends React.Component {
    state = {
        pdfInfo: [], //[{id, name, path},...]
        appState: '',
        viewableIndex: 0
    }

    setViewableIndex = (index) => { 
        // setting viewableIndex because there is case for it, if video is playing and viewableIndex is false then we are setting it in VideoPlayer Comp.
        this.setState({viewableIndex: index})
    }

    fetchData = async () => {
        const data = await fetchDataFromDirectory('videos');
        this.setState({ pdfInfo: data.pdfInfo });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.pdfInfo.length > this.dataLength) { //We are seeing if we need to scroll to top or not
            this.dataLength = this.state.pdfInfo.length;
            try {
                this.list.scrollToIndex({ animated: true, index: 0, viewPosition: 0 })
            } catch (err) {

            }
        }
    }

    handleAppStateChange = (nextAppState) => {
        //the app from background to front
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.fetchData();
        }
        //save the appState
        this.setState({ appState: nextAppState });
    }

    componentDidMount() {
        this.tabPressListener = this.props.navigation.addListener('blur', e => {
            // e.preventDefault();
            console.log('hi')
            this.setState({viewableIndex: -1})
        })
        this.videoHeight = height;
        this.dataLength = 0;
        this.fetchData();
        AppState.addEventListener('change', this.handleAppStateChange);
    }
    
    componentWillUnmount() {
        this.tabPressListener.remove()
    }
    
    onViewableItemsChanged = ({ viewableItems, changed }) => {
        // console.log("Visible items are", viewableItems);
        // console.log("Changed in this iteration", changed);
        try {
            this.setState({ viewableIndex: viewableItems[0]['index'] })
        } catch (err) {
            
        }
    }
    
    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange)
    }
    
    render() {
        // console.log(this.props.navigation.isFocused())
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
            data={this.state.pdfInfo}
            keyExtractor={item => item.id}
            ref={ref => this.list = ref}
            renderItem={({ item, index }) => {
                // console.log(index)
                return <PlayerVideo
                    source={item.path}
                    refList={this.list}
                    height={this.videoHeight}
                    index={index}
                    setViewableIndex={this.setViewableIndex}
                    isViewable={this.state.viewableIndex == index ? true : false} />
            }}
            ListEmptyComponent={() => {
                return <View style={{ backgroundColor: '#111212', justifyContent: 'center', alignItems: 'center', height: height - 40 }}>
                    {
                        this.state.pdfInfo.length == 0 && (
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

export default VideoScreen;

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#111212',
        // flex: 1
    }
})
