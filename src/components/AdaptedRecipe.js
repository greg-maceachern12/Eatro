import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const AdaptedRecipe = ({ recipe }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adapted Recipe:</Text>
      <Text style={styles.recipe}>{recipe}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.lightBackground,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipe: {
    fontSize: 16,
  },
});

export default AdaptedRecipe;