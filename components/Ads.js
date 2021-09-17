import React from 'react';
import { BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';

const Ads = () => {
    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3370162349335133~2588811453';
    return (
      <BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER}/>
    );
}

export default Ads;
