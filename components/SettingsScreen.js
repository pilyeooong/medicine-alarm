import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

export function SettingsScreen({ onBack }) {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'ko', name: t('korean', language) },
    { code: 'en', name: t('english', language) }
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settings', language)}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('language', language)}</Text>
            <Text style={styles.sectionDescription}>
              {t('languageDescription', language)}
            </Text>

            <View style={styles.optionsContainer}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.optionButton,
                    language === lang.code && styles.optionButtonActive
                  ]}
                  onPress={() => changeLanguage(lang.code)}
                >
                  <View style={styles.optionContent}>
                    <Text style={[
                      styles.optionText,
                      language === lang.code && styles.optionTextActive
                    ]}>
                      {lang.name}
                    </Text>
                    {language === lang.code && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#2D3748',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#F8FAFB',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  optionButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#5B9BD5',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  optionTextActive: {
    color: '#5B9BD5',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 20,
    color: '#5B9BD5',
    fontWeight: '700',
  },
});
