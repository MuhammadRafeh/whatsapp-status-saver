import React from 'react';
import { View, StyleSheet, AppState, FlatList } from 'react-native';
import fetchDataFromDirectory from './data/fetchDataFromWhatsApp';
import PlayerVideo from './components/VideoPlayer';
import Image from './components/Image';

class App extends React.Component {
  state = {
    pdfInfo: [],
    appState: ''
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
    this.viewableIndex = 0;
    this.fetchData();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    console.log("Visible items are", viewableItems);
    console.log("Changed in this iteration", changed);
    // this.viewableIndex = viewableItems[0]['index']
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  render() {
    console.log(this.state.pdfInfo)
    // return <PlayerVideo />
    return <FlatList
      // onViewableItemsChanged={this.onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70
      }}
      onViewableItemsChanged={this.onViewableItemsChanged}
      // viewab
      contentContainerStyle={{backgroundColor: 'white'}}
      data={this.state.pdfInfo}
      keyExtractor={item => item.id}
      ref={ref => this.list = ref}
      renderItem={({ item, index }) => {
        // console.log(index)
        if (item.name.split('.')[1] == 'jpg') return <Image source={item.path} refList={this.list} index={index} />
        if (item.name.split('.')[1] != 'nomedia') return <PlayerVideo source={item.path} refList={this.list} index={index} />
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
