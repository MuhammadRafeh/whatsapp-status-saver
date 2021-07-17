import React from 'react';
import { View, Text, StyleSheet, AppState, FlatList, Animated, Dimensions } from 'react-native';
import fetchDataFromDirectory from '../data/fetchDataFromWhatsApp';
import PlayerVideo from '../components/VideoPlayer';
import Image from '../components/Image';

const { width, height } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class ImageScreen extends React.Component {
    state = {
        pdfInfo: [], //[{id, name, path},...]
        appState: '',
        viewableIndex: 0
    }

    fetchData = async () => {
        const data = await fetchDataFromDirectory('images');
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
        this.videoHeight = height;
        this.dataLength = 0;
        this.fetchData();
        AppState.addEventListener('change', this.handleAppStateChange);
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
        return <AnimatedFlatList
            onLayout={(e) => {
                const { height } = e.nativeEvent.layout;
                this.videoHeight = height;
            }}
            decelerationRate={'fast'}
            scrollEventThrottle={16}
            viewabilityConfig={{
                viewAreaCoveragePercentThreshold: 60
            }}
            onViewableItemsChanged={this.onViewableItemsChanged}
            contentContainerStyle={styles.screen}
            data={this.state.pdfInfo}
            keyExtractor={item => item.id}
            ref={ref => this.list = ref}
            renderItem={({ item, index }) => {
                return <Image source={item.path} refList={this.list} index={index} isViewable={this.state.viewableIndex == index ? true : false} />
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

export default ImageScreen;

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#111212',
        // flex: 1
    }
})
