import React from 'react';
import { View, Text, StyleSheet, AppState, FlatList, Dimensions } from 'react-native';
import fetchDataFromDirectory from '../data/fetchDataFromWhatsApp';
import PlayerVideo from '../components/VideoPlayer';
import Image from '../components/Image';
import { connect } from 'react-redux';
import EmptyFolder from '../assets/search.svg';

const { width, height } = Dimensions.get('window');

class ImageScreen extends React.Component {
    state = {
        imagesData: [], //[{id, name, path, time},...]
        viewableIndex: 0
    }

    static getDerivedStateFromProps(props, currentState) {
        if (JSON.stringify(props.imagesData) === JSON.stringify(currentState.imagesData)) return null;

        if (props.imagesData) {
            return {
                imagesData: [...props.imagesData]
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.imagesData.length > this.dataLength) { //We are seeing if we need to scroll to top or not
            this.dataLength = this.state.imagesData.length;

            if (this.props.navigation.isFocused()) {
                this.list.scrollToOffset({ animated: true, offset: 0 });
            } else {
                this.isTheirAnyNeedToScrollToTop = true;
            }
        }
    }

    componentDidMount() {
        this.isTheirAnyNeedToScrollToTop = false;
        this.tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
            if (this.isTheirAnyNeedToScrollToTop) {
                this.isTheirAnyNeedToScrollToTop = false;
                // this.list.scrollToIndex({ animated: true, index: 0, viewPosition: 0 })
                this.list.scrollToOffset({ animated: true, offset: 0 });
            }
        })
        this.dataLength = 0;
    }

    componentWillUnmount() {
        this.tabPressListenerFocus();
    }

    render() {
        return <View
            style={styles.screen}
        >
            <FlatList
                decelerationRate={'fast'}
                scrollEventThrottle={16}
                viewabilityConfig={{
                    viewAreaCoveragePercentThreshold: 60
                }}
                onViewableItemsChanged={this.onViewableItemsChanged}
                contentContainerStyle={styles.flatlistStyle}
                data={this.state.imagesData}
                keyExtractor={item => item.id}
                ref={ref => this.list = ref}
                renderItem={({ item, index }) => {
                    return <Image
                        source={item.path}
                    />
                }}
                ListEmptyComponent={() => {
                    return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {
                            <View style={{ alignItems: 'center' }}>
                                <View style={{ marginBottom: 40 }}>
                                    <EmptyFolder width={200} height={height / 4.5} />
                                </View>
                                {/* <Tick width={320} height={200} /> */}
                                <View style={{ width: '80%' }}>
                                    <Text style={{ color: 'grey', fontFamily: 'verdana' }} numberOfLines={1} adjustsFontSizeToFit={true}>I Hope You Have Selected Your WhatsApp From Settings.</Text>
                                </View>
                                <View style={{ marginBottom: 1 }}>
                                    <Text style={{ color: 'grey', fontStyle: 'italic', borderColor: 'grey', borderBottomWidth: 1 }}>OR</Text>
                                </View>
                                <View style={{ width: '80%' }}>
                                    <Text style={{ color: 'grey', fontFamily: 'verdana' }} numberOfLines={1} adjustsFontSizeToFit={true}>May be you have currently no status on your WhatsApp.</Text>
                                </View>
                            </View>
                        }
                    </View>
                }}
            />
        </View>
    }
}

const mapStateToProps = state => {
    return {
        imagesData: state.media.images //[{id, name, path, time},...]
    }
}

// export default ImageScreen;
export default connect(mapStateToProps, null)(ImageScreen);

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
