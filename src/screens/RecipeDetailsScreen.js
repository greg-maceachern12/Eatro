import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const RecipeDetailsScreen = ({ route }) => {
  const { recipe } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <Icon name="restaurant-outline" size={32} color={colors.main} style={styles.icon} />
            <Text style={styles.title}>{recipe.title}</Text>
          </View>
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          <Text style={styles.recipeText}>{extractIngredients(recipe.content)}</Text>
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <Text style={styles.recipeText}>{extractInstructions(recipe.content)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const extractIngredients = (content) => {
  const ingredientsMatch = content.match(/Ingredients:([\s\S]*?)(?=Instructions:|$)/);
  return ingredientsMatch ? ingredientsMatch[1].trim() : 'No ingredients found.';
};

const extractInstructions = (content) => {
  const instructionsMatch = content.match(/Instructions:([\s\S]*)/);
  return instructionsMatch ? instructionsMatch[1].trim() : 'No instructions found.';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#4A90E2",
    marginBottom: 8,
  },
  recipeText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});

export default RecipeDetailsScreen;