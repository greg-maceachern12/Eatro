import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AdaptedRecipe = ({ recipe }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseRecipe = (recipeText) => {
    const titleMatch = recipeText.match(/\*\*(.*?)\*\*/);
    const title = titleMatch ? titleMatch[1] : 'Adapted Recipe';
    const [, ...contentParts] = recipeText.split('**');
    const content = contentParts.join('').trim();

    const ingredientsMatch = content.match(/Ingredients:([\s\S]*?)(?=Instructions:|$)/);
    const instructionsMatch = content.match(/Instructions:([\s\S]*)/);

    return {
      title,
      ingredients: ingredientsMatch ? ingredientsMatch[1].trim() : '',
      instructions: instructionsMatch ? instructionsMatch[1].trim() : '',
    };
  };

  const { title, ingredients, instructions } = parseRecipe(recipe);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
          <Icon name={copied ? "checkmark-circle" : "copy-outline"} size={24} color="#4CAF50" />
          <Text style={styles.copyButtonText}>{copied ? "Copied!" : "Copy"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.recipeContainer}>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        <Text style={styles.recipeText}>{ingredients}</Text>
        <Text style={styles.sectionTitle}>Instructions:</Text>
        <Text style={styles.recipeText}>{instructions}</Text>
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
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginTop: 12,
    marginBottom: 8,
  },
  recipeText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 16,
  },
});

export default AdaptedRecipe;