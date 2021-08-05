import React from 'react';
import { View, Text, StyleSheet, FlatList, Animated, Dimensions } from 'react-native';
import PlayerVideo from '../components/VideoPlayer';
import { connect } from 'react-redux';
import EmptyScreenInfo from '../components/EmptyScreenInfo';

const { height } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class VideoScreen extends React.Component {
    state = {
        videosData: [], //[{id, name, path, time},...]
        viewableIndex: 0, //-1 in order to stop all videos from play
        viewableIndexWas: -1, //when viewableIndex will be -1 then to keep track of that using viewableIndexWas.
        focused: true
    }

    isTheirAnyNeedToScrollToTop = false;
    tabPressListenerBlur = this.props.navigation.addListener('blur', e => {
        this.setState({ viewableIndex: -1, viewableIndexWas: this.state.viewableIndex, focused: false })
    })
    tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
        if (this.isTheirAnyNeedToScrollToTop) {
            this.isTheirAnyNeedToScrollToTop = false;
            // this.list.scrollToIndex({ animated: true, index: 0, viewPosition: 0 })
            this.list.scrollToOffset({ animated: true, offset: 0 });
            this.setState({ focused: true })
        } else {
            //when we focus from this we are running the video
            this.setState({ viewableIndex: this.state.viewableIndexWas, viewableIndexWas: -1, focused: true })
        }
    })
    videoHeight = height;
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
                this.list.scrollToOffset({ animated: true, offset: 0 });
            } else {
                this.isTheirAnyNeedToScrollToTop = true;
            }
        }
    }


    // componentDidMount() {
        //     showIcon: true,
        //     // showIcon: false
        //     tabBarIcon: ({ focused, color }) => (
        //         <Text style={{ marginTop: 6 }}>
        //             <Icon name={'md-add-circle'} color={color} />
        //         </Text>
        //     ),
        // }))
        // this.isTheirAnyNeedToScrollToTop = false;
        // this.tabPressListenerBlur = this.props.navigation.addListener('blur', e => {
        //     this.setState({ viewableIndex: -1, viewableIndexWas: this.state.viewableIndex, focused: false })
        // })
        // this.tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
        //     if (this.isTheirAnyNeedToScrollToTop) {
        //         this.isTheirAnyNeedToScrollToTop = false;
        //         // this.list.scrollToIndex({ animated: true, index: 0, viewPosition: 0 })
        //         this.list.scrollToOffset({ animated: true, offset: 0 });
        //         this.setState({ focused: true })
        //     } else {
        //         //when we focus from this we are running the video
        //         this.setState({ viewableIndex: this.state.viewableIndexWas, viewableIndexWas: -1, focused: true })
        //     }
        // })
        // this.videoHeight = height;
        // this.dataLength = 0;
    // }

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

    render() {
        return <View
            onLayout={(e) => {
                const { height } = e.nativeEvent.layout;
                this.videoHeight = height;
            }}
            style={styles.screen}
        >
            <AnimatedFlatList
                decelerationRate={'fast'}
                scrollEventThrottle={16}
                viewabilityConfig={{
                    viewAreaCoveragePercentThreshold: 60
                }}
                onViewableItemsChanged={this.onViewableItemsChanged}
                contentContainerStyle={styles.flatlistStyle}
                data={this.state.videosData}
                keyExtractor={item => item.id}
                ref={ref => this.list = ref}
                renderItem={({ item, index }) => {
                    return <PlayerVideo
                        source={item.path}
                        refList={this.list}
                        height={this.videoHeight ? this.videoHeight : height - 35}
                        index={index}
                        isViewable={this.state.viewableIndex == index && this.state.focused ? true : false} />
                }}
                ListEmptyComponent={<EmptyScreenInfo/>}
            />
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
    flatlistStyle: {
        flexGrow: 1,
        justifyContent: 'center'
    }
})
