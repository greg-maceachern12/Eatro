// src/screens/RecipeDetailsScreen.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const RecipeDetailsScreen = ({ route }) => {
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.recipeText}>{recipe.content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
  },
  recipeText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});

export default RecipeDetailsScreen;