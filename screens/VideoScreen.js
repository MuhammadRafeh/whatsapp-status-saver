import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PlayerVideo from '../components/VideoPlayer';
import { useSelector } from 'react-redux';
import EmptyScreenInfo from '../components/EmptyScreenInfo';

import Animated, { useAnimatedGestureHandler, useAnimatedScrollHandler, useSharedValue, useAnimatedRef, scrollTo, runOnJS } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import TabBarIcon from '../components/TabBarIcon';

const { height } = Dimensions.get('window');

const VideoScreen = props => {
    const scrollY = useSharedValue(0);
    const translationY = useSharedValue(0);
    const scrollHeight = useSharedValue();

    const [storeVideos, isSetupDirectory] = useSelector(state => [state.media.videos, state.media.isSetupDirectory])

    const { navigation } = props;

    const [videosData, setVideosData] = useState([])//[{id, name, path, time},...]
    const [viewableIndex, setViewableIndex] = useState(0) //-1 in order to stop all videos from play
    const [viewableIndexWas, setViewableIndexWas] = useState(-1)  //when viewableIndex will be -1 then to keep track of that using viewableIndexWas.
    const [focused, setFocused] = useState(true)
    const [videoHeight, setVideoHeight] = useState(height)

    const isTheirAnyNeedToScrollToTop = useRef(false);
    const dataLength = useRef(0);
    const list = useAnimatedRef();

    useEffect(() => {
        const blur = navigation.addListener('blur', e => {
            setViewableIndex(-1);
            setViewableIndexWas(viewableIndex);
            setFocused(false)
        })
        return blur;
    }, [viewableIndex, navigation])

    useEffect(() => {
        const focus = navigation.addListener('focus', e => {
            if (isTheirAnyNeedToScrollToTop.current) {
                isTheirAnyNeedToScrollToTop.current = false;
                list.current.scrollTo({ x: 0, y: 0 })
                scrollY.value = 0;
                setFocused(true);
                setViewableIndex(0)
                navigation.setOptions({
                    tabBarLabel: undefined
                })
            } else if (viewableIndexWas != -1) { //if it's -1 means that it's running on initial render
                //when we focus from this we are running the video
                setViewableIndex(viewableIndexWas);
                setViewableIndexWas(-1);
                setFocused(true);
            }
        })
        return focus;
    }, [isTheirAnyNeedToScrollToTop.current, viewableIndexWas])

    useEffect(() => {
        if (JSON.stringify(storeVideos) === JSON.stringify(videosData)) return
        setVideosData([...storeVideos]);
        setViewableIndex(isSetupDirectory ? 0 : viewableIndex)//Display first video after setup directory
        if (isSetupDirectory) {
            scrollY.value = 0
            if (!navigation.isFocused() && storeVideos.length > 1) {
                navigation.setOptions({
                    tabBarLabel: ({ color }) => <TabBarIcon color={color} title={'VIDEOS'} />
                })
            } else {
                navigation.setOptions({
                    tabBarLabel: undefined
                })
            }
        }
    }, [storeVideos])

    useEffect(() => {
        if (videosData.length > dataLength.current) { //We are seeing if we need to scroll to top or not
            dataLength.current = videosData.length;

            if (navigation.isFocused()) {
                list.current.scrollTo({ x: 0, y: 0 })
                scrollY.value = 0
            } else {
                isTheirAnyNeedToScrollToTop.current = true;
                navigation.setOptions({
                    tabBarLabel: ({ color }) => <TabBarIcon color={color} title={'VIDEOS'} />
                })
            }
        } else {
            dataLength.current = videosData.length;
        }
    }, [videosData, navigation])



    const moveToNext = (index) => {
        if (videosData[index + 1]) {
            setViewableIndex(index + 1)
            const nextItem = (index * videoHeight) + videoHeight
            list.current.scrollTo({ x: 0, y: nextItem })
            scrollY.value = nextItem;
        }
    }

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            const offsetY = e.contentOffset.y;
            const index = Math.round(offsetY / scrollHeight.value)
            if (index != viewableIndex) {
                runOnJS(setViewableIndex)(index)
            }
        }
    })

    const panHandler = useAnimatedGestureHandler({
        onActive: (e) => {
            translationY.value = e.translationY;
            scrollTo(list, 0, scrollY.value + (-translationY.value), false)
        },
        onFinish: (e) => {
            const index = Math.round((scrollY.value + (-translationY.value)) / scrollHeight.value) //index also gives bad values
            // console.log('currentIndex', index, 'scrollHeight', scrollHeight.value)
            console.log('------->' ,index)
            let nextItem = 0;
            if (e.velocityY < -10 && (index < videosData.length - 1 && index >= 0)) {//going down
                console.log('1sr')

                if (Math.max(index, (scrollY.value + (-translationY.value)) / scrollHeight.value) == index){
                    nextItem = ((index) * scrollHeight.value)
                } else {
                    nextItem = ((index) * scrollHeight.value) + scrollHeight.value
                }
            } else if (e.velocityY > 10 && (index <= videosData.length - 1 && index > 0)) { //going up
                console.log('2nd')

                nextItem = ((index - 1) * scrollHeight.value)
            } else if (index <= videosData.length - 1 && index >= 0) {
                console.log('3rd')

                nextItem = ((index) * scrollHeight.value)
                console.log('3rd', index)
            }
            scrollTo(list, 0, nextItem, true)
            scrollY.value = nextItem
        }
    });

    return <View
        onLayout={(e) => {
            const { height } = e.nativeEvent.layout;
            setVideoHeight(height)
            scrollHeight.value = height;
        }}
        style={styles.screen}
    >
        {
            videosData.length != 0 ? (
                <Animated.ScrollView
                    decelerationRate={'fast'}
                    scrollEventThrottle={16}
                    onScroll={scrollHandler}
                    scrollEnabled={false}
                    ref={list}
                >
                    {
                        videosData.map((data, index) => {
                            return (
                                <View key={index}>
                                    <PanGestureHandler onGestureEvent={panHandler}>
                                        <Animated.View>
                                            <PlayerVideo
                                                moveToNext={moveToNext}
                                                source={data.path}
                                                height={videoHeight ? videoHeight : height - 35}
                                                index={index}
                                                isViewable={viewableIndex == index && focused ? true : false} />
                                        </Animated.View>
                                    </PanGestureHandler>
                                </View>
                            )
                        })
                    }
                </Animated.ScrollView>
            ) : (
                <View style={styles.emptyStyle}>
                    <EmptyScreenInfo />
                </View>
            )
        }
    </View>
}

export default VideoScreen;

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#111212',
        flex: 1
    },
    emptyStyle: {
        flex: 1,
        justifyContent: 'center'
    }
})
