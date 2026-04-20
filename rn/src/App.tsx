import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Scoreboard } from './components/Scoreboard';

export default function App() {
  return (
    <View style={styles.root}>
      <Scoreboard />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
