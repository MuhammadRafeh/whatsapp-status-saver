import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Image from '../components/Image';
import { connect } from 'react-redux';
import EmptyScreenInfo from '../components/EmptyScreenInfo';
import TabBarIcon from '../components/TabBarIcon';
import Ads from '../components/Ads';

class ImageScreen extends React.Component {
    state = {
        imagesData: [], //[{name, path, time},...]
        isSetupDirectory: false
    }

    isTheirAnyNeedToScrollToTop = false;
    tabPressListenerFocus = this.props.navigation.addListener('focus', e => {
        if (this.isTheirAnyNeedToScrollToTop) {
            this.isTheirAnyNeedToScrollToTop = false;
            this.list?.scrollTo({ x: 0, y: 0, animated: true })
            this.props.navigation.setOptions({
                tabBarLabel: undefined
            })
        }
    })
    dataLength = 0;

    static getDerivedStateFromProps(props, currentState) {
        if (JSON.stringify(props.imagesData) === JSON.stringify(currentState.imagesData)) return null;
        return {
            imagesData: [...props.imagesData],
            isSetupDirectory: props.isSetupDirectory
        }
    }

    componentDidUpdate() {
        if (this.state.imagesData.length > this.dataLength) { //We are seeing if we need to scroll to top or not
            this.dataLength = this.state.imagesData.length;

            if (this.props.navigation.isFocused()) {
                this.list?.scrollTo({ x: 0, y: 0, animated: true })
            } else {
                this.isTheirAnyNeedToScrollToTop = true;
                this.props.navigation.setOptions({
                    tabBarLabel: ({ color }) => <TabBarIcon color={color} title={'IMAGES'} />
                })
            }
        } else {
            this.dataLength = this.state.imagesData.length;
            if (this.props.isSetupDirectory) {
                if (!this.props.navigation.isFocused() && this.state.imagesData.length > 1) {
                    this.props.navigation.setOptions({
                        tabBarLabel: ({ color }) => <TabBarIcon color={color} title={'IMAGES'} />
                    })
                } else {
                    this.props.navigation.setOptions({
                        tabBarLabel: undefined
                    })
                }
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
            {
                this.state.imagesData.length != 0 ? (
                    <>
                        <ScrollView ref={ref => this.list = ref}>
                            <Ads />
                            {
                                this.state.imagesData.map((img, index) => <Image key={index} source={img.path} />)
                            }
                            <Ads />
                        </ScrollView>
                    </>
                ) : (
                    <View style={styles.emptyStyle}>
                        <EmptyScreenInfo />
                    </View>
                )
            }
        </View>
    }
}

const mapStateToProps = state => {
    return {
        imagesData: state.media.images, //[{name, path, time},...]
        isSetupDirectory: state.media.isSetupDirectory
    }
}

export default connect(mapStateToProps, null)(ImageScreen);

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
