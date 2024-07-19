// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeInput from '../components/RecipeInput';
import AdjustmentsInput from '../components/AdjustmentsInput';
import AdaptButton from '../components/AdaptButton';
import AdaptedRecipe from '../components/AdaptedRecipe';
import PremiumButton from '../components/PremiumButton';
import { colors } from '../styles/colors';

const HomeScreen = () => {
  const [recipe, setRecipe] = useState('');
  const [adjustments, setAdjustments] = useState('');
  const [adaptedRecipe, setAdaptedRecipe] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdaptRecipe = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(
        'https://recipequeen.azurewebsites.net/api/adjust?code=roeLI54-jI-q1rZal9YkBJsms3NKhDQj32DOKUYqkUeLAzFuv3d3UQ%3D%3D',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipe: recipe,
            adjustment: adjustments,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to adapt recipe');
      }
  
      const data = await response.json(); // Parse the response as JSON
      console.log('Received data:', data); // Log the parsed data
  
      if (data && data.response) {
        setAdaptedRecipe(data.response); // Set only the 'response' field
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('An error occurred while adapting the recipe. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Recipe Adapter</Text>
        <RecipeInput value={recipe} onChangeText={setRecipe} />
        <AdjustmentsInput value={adjustments} onChangeText={setAdjustments} />
        <AdaptButton onPress={handleAdaptRecipe} disabled={isLoading} />
        {isLoading && <ActivityIndicator size="large" color={colors.primary} />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {adaptedRecipe ? <AdaptedRecipe recipe={adaptedRecipe} /> : null}
        <PremiumButton isPremium={isPremium} onToggle={() => setIsPremium(!isPremium)} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: colors.error,
    marginTop: 10,
  },
});

export default HomeScreen;