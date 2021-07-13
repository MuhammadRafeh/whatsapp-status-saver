import React from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, AppState } from 'react-native';
// import VideoPlayer from 'react-native-video-controls';
import fetchDataFromDirectory from './data/fetchDataFromWhatsApp';
import PlayerVideo from './components/VideoPlayer';

class App extends React.Component {
  state = {
    pdfInfo: [],
    appState: ''
  }

  // componentDidMount() {
  //   fetchDataFromDirectory();
  // }
  
  handleAppStateChange = (nextAppState) => {
    //the app from background to front
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('hi')
    }
    //save the appState
    this.setState({ appState: nextAppState });
  }
  componentDidMount(){
    AppState.addEventListener('change', this.handleAppStateChange);
   }

      componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange)
      }

  render() {
    return <PlayerVideo/>
  }
}

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
})
