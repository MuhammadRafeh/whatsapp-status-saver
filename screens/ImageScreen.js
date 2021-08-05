import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
import Image from '../components/Image';
import { connect } from 'react-redux';
import EmptyScreenInfo from '../components/EmptyScreenInfo';

class ImageScreen extends React.Component {
    state = {
        imagesData: [], //[{id, name, path, time},...]
    }

    isTheirAnyNeedToScrollToTop = false;
    tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
        if (this.isTheirAnyNeedToScrollToTop) {
            this.isTheirAnyNeedToScrollToTop = false;
            this.list.scrollTo({ x: 0, y: 0, animated: true })
        }
    })
    dataLength = 0;

    static getDerivedStateFromProps(props, currentState) {
        if (JSON.stringify(props.imagesData) === JSON.stringify(currentState.imagesData)) return null;
        return {
            imagesData: [...props.imagesData]
        }
    }

    componentDidUpdate() {
        if (this.state.imagesData.length > this.dataLength) { //We are seeing if we need to scroll to top or not
            this.dataLength = this.state.imagesData.length;

            if (this.props.navigation.isFocused()) {
                this.list.scrollTo({ x: 0, y: 0, animated: true })
            } else {
                this.isTheirAnyNeedToScrollToTop = true;
            }
        }
    }

    componentWillUnmount() {
        this.tabPressListenerFocus();
    }

    render() {
        return <View
            style={styles.screen}
        >
            <ScrollView ref={ref => this.list = ref}>
                {
                    this.state.imagesData.map(img => <Image source={img.path} />)
                }
            </ScrollView>
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
