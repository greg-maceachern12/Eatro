// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DiscoverScreen = () => (
  <View style={styles.emptyContainer}>
    <Icon name="balloon-outline" size={48} />
  <Text style={styles.emptyText}>Coming Soon</Text>
</View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DiscoverScreen;