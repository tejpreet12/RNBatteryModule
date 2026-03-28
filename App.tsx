import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BatteryScreen } from './src/features/battery/BatteryScreen';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BatteryScreen />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
