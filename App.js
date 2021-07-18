import React, { useState } from 'react';
import { Text, View, Button, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import TopTabNavigator from './navigators/TopTabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Tick from './assets/tick.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import button from './sounds/playSoundFunc';

const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isWhatsApp, setIsWhatsApp] = useState(true);
  const [isBusinessWhatsApp, setIsBusinessWhatsApp] = useState(false);
  const [isYoWhatsApp, setIsYoWhatsApp] = useState(false);

  const toggleModal = () => {
    button.play((success) => {
      if (success) {
        button.stop();
      }
    });
    setModalVisible(!isModalVisible);
  };

  const handleOptionPress = type => {
    if (type == 'whatsapp' && !isWhatsApp){
      setIsWhatsApp(true);
      setIsBusinessWhatsApp(false);
      setIsYoWhatsApp(false);
    } else if (type == 'Bwhatsapp' && !isBusinessWhatsApp){
      setIsWhatsApp(false);
      setIsBusinessWhatsApp(true);
      setIsYoWhatsApp(false);
    } else if (type == 'Ywhatsapp' && !isYoWhatsApp){
      setIsWhatsApp(false);
      setIsBusinessWhatsApp(false);
      setIsYoWhatsApp(true);
    } 
  }

  return (
    <>
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', marginBottom: 10, fontWeight: 'bold' }}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 17 }}>What You Are Using!</Text>
          </View>
          <View style={{ width: '80%', marginBottom: 10 }}>

            <TouchableWithoutFeedback onPress={handleOptionPress.bind(null, 'whatsapp')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                <View style={styles.flex1}>
                  <Text style={{ color: 'white', textAlign: 'left' }}>WhatsApp</Text>
                </View>
                <View style={styles.flex1}>
                  {isWhatsApp && (
                    <Tick width={220} height={16} />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleOptionPress.bind(null, 'Bwhatsapp')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                <View style={styles.flex1}>
                  <Text style={{ color: 'white', textAlign: 'left' }}>Business WhatsApp</Text>
                </View>
                <View style={styles.flex1}>
                  {isBusinessWhatsApp && (
                    <Tick width={220} height={16} />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleOptionPress.bind(null, 'Ywhatsapp')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                <View style={styles.flex1}>
                  <Text style={{ color: 'white', textAlign: 'left' }}>Yo WhatsApp</Text>
                </View>
                <View style={styles.flex1}>
                  {isYoWhatsApp && (
                    <Tick width={220} height={16} />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>

          </View>

          <View style={{ width: '80%' }}>
            <Button title="Done" onPress={toggleModal} color={'grey'} />
          </View>
        </View>
      </Modal>

      <StatusBar barStyle={'light-content'} backgroundColor={'#1B1B1B'} />
      <View
        style={styles.header}
      >
        <View style={styles.labelContainer}>
          <Text style={styles.label}>WhatsApp Status Saver</Text>
        </View>
        <View style={styles.settingContainer}>
          <TouchableOpacity onPress={() => {
            toggleModal();
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
  },
  flex1: {
    flex: 1
  }
})
