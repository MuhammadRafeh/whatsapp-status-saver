import React from 'react';
import { View, Text, StyleSheet, AppState, FlatList, Dimensions } from 'react-native';
import fetchDataFromDirectory from '../data/fetchDataFromWhatsApp';
import PlayerVideo from '../components/VideoPlayer';
import Image from '../components/Image';
import { connect } from 'react-redux';

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
        return <FlatList
            decelerationRate={'fast'}
            scrollEventThrottle={16}
            viewabilityConfig={{
                viewAreaCoveragePercentThreshold: 60
            }}
            onViewableItemsChanged={this.onViewableItemsChanged}
            contentContainerStyle={styles.screen}
            data={this.state.imagesData}
            keyExtractor={item => item.id}
            ref={ref => this.list = ref}
            renderItem={({ item, index }) => {
                return <Image
                    source={item.path}
                />
            }}
            ListEmptyComponent={() => {
                return <View style={{ backgroundColor: '#111212', justifyContent: 'center', alignItems: 'center', height: height - 40 }}>
                    {
                        this.state.imagesData.length == 0 && (
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
        imagesData: state.media.images //[{id, name, path, time},...]
    }
}

// export default ImageScreen;
export default connect(mapStateToProps, null)(ImageScreen);

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#111212',
        // flex: 1
    }
})

