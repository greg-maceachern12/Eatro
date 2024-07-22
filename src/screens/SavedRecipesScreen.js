// src/screens/SavedRecipesScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecipes } from '../context/RecipeContext';
import { colors } from '../styles/colors';

const RecipeCard = ({ recipe, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{recipe.title}</Text>
    <Text style={styles.cardContent} numberOfLines={2}>
      {recipe.content}
    </Text>
  </TouchableOpacity>
);

const SavedRecipesScreen = () => {
  const { savedRecipes } = useRecipes();
  const navigation = useNavigation();

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetails', { recipe });
  };

  return (
    <View style={styles.container}>
      {savedRecipes.length > 0 ? (
        <FlatList
          data={savedRecipes}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              onPress={() => handleRecipePress(item)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
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
  row: {
    flex: 1,
    justifyContent: 'space-between',
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
    width: '48%', // Adjust as needed
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default SavedRecipesScreen;