import React, { useState, useEffect } from 'react';
import { Text, View, Button, StatusBar, AppState, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import TopTabNavigator from './navigators/TopTabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Tick from './assets/tick.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import button from './sounds/playSoundFunc';
import { Provider, useDispatch } from "react-redux";
import store from './redux/store';
import { setMedia } from './redux/actions';
import admob, { MaxAdContentRating, InterstitialAd, TestIds } from '@react-native-firebase/admob';
import Snackbar from "react-native-snackbar";

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@whichwhatsapp', value)
  } catch (e) {
  }
}
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3370162349335133/5596395974';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const [isWhatsApp, setIsWhatsApp] = useState(true);
  const [isBusinessWhatsApp, setIsBusinessWhatsApp] = useState(false);
  const [isYoWhatsApp, setIsYoWhatsApp] = useState(false);
  const [whichWhatsApp, setWhichWhatsApp] = useState('whatsapp'); //whatsapp, Bwhatsapp, Ywhatsapp
  const [whichWhatsAppInitialValue, setWhichWhatsAppInitialValue] = useState('');

  const dispatch = useDispatch();


  const handleAppStateChange = (newState) => {
    if (newState === "active") {
      dispatch(setMedia());
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@whichwhatsapp')
      if (value !== null) {
        if (value == 'Bwhatsapp') {
          setIsWhatsApp(false);
          setIsBusinessWhatsApp(true);
          setIsYoWhatsApp(false);
          setWhichWhatsApp(value)
          setWhichWhatsAppInitialValue(value);
        } else if (value == 'Ywhatsapp') {
          setIsWhatsApp(false);
          setIsBusinessWhatsApp(false);
          setIsYoWhatsApp(true);
          setWhichWhatsApp(value)
          setWhichWhatsAppInitialValue(value);
        }
      }
    } catch (e) {
    }
  }

  const toggleModal = (isSubmit = false) => {
    button.play((success) => {
      if (success) {
        button.stop();
      }
    });
    if (isSubmit && whichWhatsApp != whichWhatsAppInitialValue) {
      storeData(whichWhatsApp);
      dispatch(setMedia(true));
    }

    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    getData();
    dispatch(setMedia(true));

    AppState.addEventListener('change', handleAppStateChange);

    admob()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
      })
      .then(() => { });

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  const handleOptionPress = type => {
    if (type == 'whatsapp' && !isWhatsApp) {
      setIsWhatsApp(true);
      setIsBusinessWhatsApp(false);
      setIsYoWhatsApp(false);
      setWhichWhatsApp('whatsapp');
    } else if (type == 'Bwhatsapp' && !isBusinessWhatsApp) {
      setIsWhatsApp(false);
      setIsBusinessWhatsApp(true);
      setIsYoWhatsApp(false);
      setWhichWhatsApp('Bwhatsapp')
    } else if (type == 'Ywhatsapp' && !isYoWhatsApp) {
      setIsWhatsApp(false);
      setIsBusinessWhatsApp(false);
      setIsYoWhatsApp(true);
      setWhichWhatsApp('Ywhatsapp')
    }
  }
  return (
    <>
      <Modal isVisible={isModalVisible} useNativeDriver={true} onBackButtonPress={toggleModal.bind(null, false)}>
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
            <Button title="Save" onPress={toggleModal.bind(null, true)} color={'grey'} />
          </View>
        </View>
      </Modal>

      <StatusBar barStyle={'light-content'} backgroundColor={'#1B1B1B'} />
      <View
        style={styles.header}
      >
        <View style={styles.labelContainer}>
          <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit={true}>WhatsApp Status Saver</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{ backgroundColor: 'grey', padding: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, borderRadius: 4 }}
            onPress={() => {
              button.play((success) => {
                if (success) {
                  button.stop();
                }
              });
              dispatch(setMedia());
              Snackbar.show({
                text: 'Refreshed!',
                duration: Snackbar.LENGTH_SHORT,
              });
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'white' }}>
              Refresh
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            toggleModal();
            try {
              interstitial.show();
            } catch (err) {
              interstitial.load();
            }
          }} style={{ paddingLeft: 18, paddingRight: 15, paddingTop: 15 }}>
            <Image source={require('./assets/settings.png')} style={{ overlayColor: 'white', tintColor: 'white', width: 19, height: 19, flex: 1 }} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>
      </View>
      <NavigationContainer>
        <TopTabNavigator />
      </NavigationContainer>
    </>
  );
}

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default AppWrapper;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  labelContainer: {
    marginTop: 15,
    paddingLeft: 15,
    width: '60%'
  },
  label: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold'
  },
  flex1: {
    flex: 1
  }
})
