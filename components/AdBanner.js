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

// 개발 환경에서는 Google 테스트 광고 ID 사용
const adUnitId = __DEV__
  ? 'ca-app-pub-3940256099942544/2934735716'  // Google 공식 테스트 배너 ID
  : Platform.select({
      ios: 'ca-app-pub-2370970221825852/4848317827',
    });

export const AdBanner = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        await mobileAds().initialize();
        setIsInitialized(true);
        console.log('✅ AdMob 초기화 완료');
      } catch (error) {
        console.error('❌ AdMob 초기화 실패:', error);
        setIsInitialized(false);
      }
    };

    if (mobileAds) {
      initializeAdMob();
    } else {
      console.log('⚠️ AdMob 모듈을 사용할 수 없습니다');
      setIsInitialized(false);
    }
  }, []);

  // AdMob이 초기화되지 않았거나 BannerAd가 없으면 아무것도 표시하지 않음
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
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          console.log('✅ 광고 로드 성공');
          setIsAdLoaded(true);
        }}
        onAdFailedToLoad={(error) => {
          console.log('⚠️ 광고 로드 실패:', error.message);
        }}
      />
    </View>
  );
};
