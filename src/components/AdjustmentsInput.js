// src/components/AdjustmentsInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const AdjustmentsInput = ({ value, onChangeText }) => (
  <TextInput
    style={styles.input}
    placeholder="What would you like to change with the recipe?"
    value={value}
    onChangeText={onChangeText}
    keyboardType="numeric"
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default AdjustmentsInput;