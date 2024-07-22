// src/screens/SavedRecipesScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRecipes } from '../context/RecipeContext';
import { colors } from '../styles/colors';

const RecipeCard = ({ recipe }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{recipe.title}</Text>
    <Text style={styles.cardContent}>{recipe.content}</Text>
  </View>
);

const SavedRecipesScreen = () => {
  const { savedRecipes } = useRecipes();

  return (
    <View style={styles.container}>
      {savedRecipes.length > 0 ? (
        <FlatList
          data={savedRecipes}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>No saved recipes yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default SavedRecipesScreen;