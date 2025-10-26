import React, { useEffect, useState } from 'react';
import { View, Platform, Text } from 'react-native';

// Expo Go 환경에서는 애드몹 모듈을 import하지 않음
let mobileAds, BannerAd, BannerAdSize, TestIds;
try {
  const googleMobileAds = require('react-native-google-mobile-ads');
  mobileAds = googleMobileAds.default;
  BannerAd = googleMobileAds.BannerAd;
  BannerAdSize = googleMobileAds.BannerAdSize;
  TestIds = googleMobileAds.TestIds;
} catch (error) {
  // Expo Go 환경에서는 애드몹 사용 불가
}

const adUnitId = __DEV__
  ? TestIds?.BANNER
  : 'ca-app-pub-2370970221825852/4848317827';  // iOS 배너 광고 단위 ID

export const AdBanner = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [adError, setAdError] = useState(null);

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        await mobileAds().initialize();
        setIsInitialized(true);
        console.log('AdMob 초기화 완료');
      } catch (error) {
        console.log('AdMob 초기화 실패:', error.message);
        setIsInitialized(false);
      }
    };

    if (mobileAds) {
      initializeAdMob();
    } else {
      setIsInitialized(false);
    }
  }, []);

  // AdMob이 초기화되지 않았으면 빈 공간
  if (!isInitialized || !BannerAd) {
    return null;
  }

  return (
    <View style={{
      alignItems: 'center',
      backgroundColor: '#e3f2fd',
      paddingVertical: 10,
      minHeight: 70,
      justifyContent: 'center'
    }}>
      {!adError && (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          onAdLoaded={() => {
            console.log('✅ 광고 로드 성공');
            setIsAdLoaded(true);
            setAdError(null);
          }}
          onAdFailedToLoad={(error) => {
            console.log('⚠️ 광고 로드 실패 (정상 동작):', error.message);
            setAdError(error);
          }}
        />
      )}
    </View>
  );
};
