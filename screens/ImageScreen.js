import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import Image from '../components/Image';
import { connect } from 'react-redux';
import EmptyScreenInfo from '../components/EmptyScreenInfo';
import TabBarIcon from '../components/TabBarIcon';
import Ads from '../components/Ads';
import Box from '../components/Box';
import BackContainer, { conStyle } from '../components/BackContainer';

class ImageScreen extends React.Component {
    state = {
        imagesData: [], //[{name, path, time},...]
        isSetupDirectory: false,
        isShowSlider: false
    }

    handleBackButtonClick = () => {
        if (this.state.isShowSlider) {
            this.setState({isShowSlider: false})
            return true
        } else {
            return false
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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

    handlePress = index => {
        this.setState({ isShowSlider: true })
        setTimeout(() => {
            this.list?.scrollTo({ x: 0, y: index * 400, animated: true })
        }, 1000)
    }

    componentWillUnmount() {
        this.tabPressListenerFocus();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        return <View
            style={styles.screen}
        >
            {
                this.state.imagesData.length != 0 ? (
                    this.state.isShowSlider ? (
                        <>
                            <ScrollView ref={ref => this.list = ref}>
                                {
                                    this.state.imagesData.map((img, index) => <Image key={index} source={img.path} />)
                                }
                                <Ads />
                            </ScrollView>
                            <View style={conStyle}>
                                <TouchableOpacity onPress={() => { this.setState({ isShowSlider: false }) }} style={{ width: 40 }}>
                                    <BackContainer />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <ScrollView ref={ref => this.list = ref}>
                            {
                                Array(Math.ceil(this.state.imagesData.length / 2)).fill(0).map((i, row) => (
                                    <View style={{ flexDirection: 'row' }} key={row}>
                                        <Box index={row * 2} source={this.state.imagesData[row * 2].path} handlePress={this.handlePress} />
                                        {
                                            this.state.imagesData[row * 2 + 1] && (
                                                <Box index={row * 2 + 1} source={this.state.imagesData[row * 2 + 1].path} handlePress={this.handlePress} />
                                            )
                                        }
                                    </View>
                                ))
                            }
                            <Ads />
                        </ScrollView>
                    )
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
    },
    emptyStyle: {
        flex: 1,
        justifyContent: 'center'
    }
})
