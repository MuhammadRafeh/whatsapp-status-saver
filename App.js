import React from 'react';
import { Text, View, StyleSheet, AppState, FlatList } from 'react-native';
import fetchDataFromDirectory from './data/fetchDataFromWhatsApp';
import PlayerVideo from './components/VideoPlayer';
import Image from './components/Image';

class App extends React.Component {
  state = {
    pdfInfo: [],
    appState: '',
    viewableIndex: 0
  }

  fetchData = async () => {
    const data = await fetchDataFromDirectory();
    this.setState({ pdfInfo: data.pdfInfo })
  }
  // }

  handleAppStateChange = (nextAppState) => {
    //the app from background to front
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.fetchData();
    }
    //save the appState
    this.setState({ appState: nextAppState });
  }

  componentDidMount() {
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
    return <FlatList
      snapToAlignment={'top'}
      decelerationRate={'fast'}
      viewabilityConfig={{
        // itemVisiblePercentThreshold: 90,
        viewAreaCoveragePercentThreshold: 60
      }}
      // extraData={this.state.viewableIndex}
      onViewableItemsChanged={this.onViewableItemsChanged}
      // scr
      contentContainerStyle={{ backgroundColor: 'black' }}
      data={this.state.pdfInfo}
      keyExtractor={item => item.id}
      ref={ref => this.list = ref}
      renderItem={({ item, index }) => {
        // console.log(index)
        console.log('--------------------> ', this.state.viewableIndex)
        if (item.name.split('.')[1] == 'jpg') return <Image source={item.path} refList={this.list} index={index} isViewable={this.state.viewableIndex == index ? true : false} />
        if (item.name.split('.')[1] != 'nomedia') return <>
          <View>
            <Text style={{ color: 'white' }}>{this.state.viewableIndex}</Text>
            <PlayerVideo
              source={item.path}
              refList={this.list}
              index={index}
              isViewable={this.state.viewableIndex == index ? true : false} />
          </View>
        </>
        return <View />
      }}
    />
  }
}

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white'
  }
})
