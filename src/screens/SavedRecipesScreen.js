import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecipes } from '../context/RecipeContext';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatDistanceToNow } from 'date-fns';

const RecipeCard = ({ recipe, onPress, onDelete }) => (
  <View style={styles.card}>
    <TouchableOpacity onPress={onPress} style={styles.cardContent}>
      <View style={styles.titleContainer}>
        <Icon name="restaurant-outline" size={24} color={colors.main} style={styles.icon} />
        <Text style={styles.cardTitle} numberOfLines={1}>{recipe.title}</Text>
      </View>
      {recipe.timestamp && (
        <Text style={styles.timestamp}>
          {formatDistanceToNow(new Date(recipe.timestamp), { addSuffix: true })}
        </Text>
      )}
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

  // Sort recipes by timestamp, most recent first
  const sortedRecipes = [...savedRecipes].sort((a, b) => {
    const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
    const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
    return dateB - dateA;
  });

  return (
    <View style={styles.container}>
      {sortedRecipes.length > 0 ? (
        <FlatList
          data={sortedRecipes}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              onPress={() => handleRecipePress(item)}
              onDelete={() => handleDeleteRecipe(item)}
            />
          )}
          keyExtractor={(item, index) => item.timestamp || index.toString()}
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
    borderRadius: 12,
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
    padding: 16,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 16,
    alignSelf: 'stretch',
    justifyContent: 'center',
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