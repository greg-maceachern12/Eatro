import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AdjustmentsInput = ({ value, onChangeText }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Recipe Adjustments</Text>
    <View style={styles.inputContainer}>
      {/* <Icon name="create-outline" size={24} color="#666" style={styles.icon} /> */}
      <TextInput
        style={styles.input}
        placeholder="e.g., make it vegan, reduce sugar, double the recipe"
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={3}
      />
    </View>
    <Text style={styles.helperText}>Tell us how you'd like to adjust the recipe.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    marginTop: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    minHeight: 30,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default AdjustmentsInput;