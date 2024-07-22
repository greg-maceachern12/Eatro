// src/components/AdaptButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const AdaptButton = ({ onPress, disabled }) => (
  <TouchableOpacity 
    style={[styles.button, disabled && styles.disabledButton]} 
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.buttonText}>Adapt Recipe</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.main,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdaptButton;