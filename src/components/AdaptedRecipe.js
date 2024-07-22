import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AdaptedRecipe = ({ recipe }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Adapted Recipe:</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
          <Icon name={copied ? "checkmark-circle" : "copy-outline"} size={24} color="#4CAF50" />
          <Text style={styles.copyButtonText}>{copied ? "Copied!" : "Copy"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.recipeContainer}>
        <Text style={styles.recipe}>{recipe}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
  },
  copyButtonText: {
    marginLeft: 4,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  recipeContainer: {
    maxHeight: 300,
  },
  recipe: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

export default AdaptedRecipe;