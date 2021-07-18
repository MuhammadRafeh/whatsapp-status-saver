import React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import TopTabNavigator from './navigators/TopTabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import button from './sounds/playSoundFunc';


const App = () => {
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
      <View
        style={styles.header}
      >
        <View style={styles.labelContainer}>
          <Text style={styles.label}>WhatsApp Status Saver</Text>
        </View>
        <View style={styles.settingContainer}>
          <TouchableOpacity onPress={() => {
            button.play();
          }}>
            <Icon name={'settings'} size={20} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
      <NavigationContainer>
        <TopTabNavigator />
      </NavigationContainer>
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  labelContainer: {
    marginTop: 15,
    marginLeft: 15
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19
  },
  settingContainer: {
    marginRight: 15,
    marginTop: 15
  }
})
