import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppLogo from './assets/AppLogo';

export default function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <AppLogo size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B9BD5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
