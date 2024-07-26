import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecipes } from '../context/RecipeContext';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const RecipeCard = ({ recipe, onPress, onDelete }) => (
  <View style={styles.card}>
    <TouchableOpacity onPress={onPress} style={styles.cardContent}>
      <Icon name="restaurant-outline" size={24} color={colors.main} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{recipe.title}</Text>
        <Text style={styles.cardPreview} numberOfLines={2}>
          {recipe.content}
        </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Icon name="trash-outline" size={24} color={colors.error} />
    </TouchableOpacity>
  </View>
);

const SavedRecipesScreen = () => {
  const { savedRecipes, updateSavedRecipes } = useRecipes();
  const navigation = useNavigation();

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetails', { recipe });
  };

  const handleDeleteRecipe = (recipeToDelete) => {
    const updatedRecipes = savedRecipes.filter(recipe => recipe !== recipeToDelete);
    updateSavedRecipes(updatedRecipes);
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
              onDelete={() => handleDeleteRecipe(item)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="book-outline" size={48} color={colors.gray} />
          <Text style={styles.emptyText}>No saved recipes yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardPreview: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default SavedRecipesScreen;