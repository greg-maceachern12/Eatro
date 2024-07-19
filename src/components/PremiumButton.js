// src/components/PremiumButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const PremiumButton = ({ isPremium, onToggle }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onToggle}>
      <Text style={styles.buttonText}>
        {isPremium ? 'Cancel Premium' : 'Go Premium'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.premium,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PremiumButton;