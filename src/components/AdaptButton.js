import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from "../styles/colors"

const AdaptButton = ({ onPress, disabled }) => (
  <TouchableOpacity 
    style={[styles.button, disabled && styles.disabledButton]} 
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.buttonContent}>
      <Icon name="color-wand-outline" size={24} color={disabled ? '#A9A9A9' : '#FFFFFF'} />
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>Modify Recipe</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.main,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  disabledText: {
    color: '#A9A9A9',
  },
});

export default AdaptButton;