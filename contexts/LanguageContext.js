import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const LanguageContext = createContext();

const LANGUAGE_STORAGE_KEY = '@language';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ko');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        setLanguage(savedLanguage);
      } else {
        // 저장된 언어가 없으면 디바이스 언어 기준으로 설정
        try {
          const locales = Localization.getLocales();
          const deviceLocale = (locales && locales.length > 0 && locales[0]?.languageCode) || 'en';
          const languageCode = deviceLocale.startsWith('ko') ? 'ko' : 'en';
          setLanguage(languageCode);
          console.log(`📱 디바이스 언어 감지: ${deviceLocale} → 앱 언어: ${languageCode}`);
        } catch (localizationError) {
          console.error('디바이스 언어 감지 실패, 기본값(영어) 사용:', localizationError);
          setLanguage('en');
        }
      }
    } catch (error) {
      console.error('Error loading language:', error);
      setLanguage('en'); // 최종 폴백
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
