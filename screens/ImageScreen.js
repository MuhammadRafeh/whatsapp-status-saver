import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import Image from '../components/Image';
import { connect } from 'react-redux';
import EmptyScreenInfo from '../components/EmptyScreenInfo';

class ImageScreen extends React.Component {
    state = {
        imagesData: [], //[{id, name, path, time},...]
        viewableIndex: 0
    }

    isTheirAnyNeedToScrollToTop = false;
    tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
        if (this.isTheirAnyNeedToScrollToTop) {
            this.isTheirAnyNeedToScrollToTop = false;
            this.list.scrollToOffset({ animated: true, offset: 0 });
        }
    })
    dataLength = 0;

    static getDerivedStateFromProps(props, currentState) {
        if (JSON.stringify(props.imagesData) === JSON.stringify(currentState.imagesData)) return null;
        return {
            imagesData: [...props.imagesData]
        }
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

    // componentDidMount() {
    // this.isTheirAnyNeedToScrollToTop = false;
    // this.tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
    //     if (this.isTheirAnyNeedToScrollToTop) {
    //         this.isTheirAnyNeedToScrollToTop = false;
    //         this.list.scrollToOffset({ animated: true, offset: 0 });
    //     }
    // })
    // this.dataLength = 0;
    // }

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
                ListEmptyComponent={<EmptyScreenInfo />}
            />
        </View>
    }
}

const mapStateToProps = state => {
    return {
        imagesData: state.media.images //[{id, name, path, time},...]
    }
}

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
