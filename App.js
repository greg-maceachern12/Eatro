// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import SavedRecipesScreen from './src/screens/SavedRecipesScreen';
import RecipeDetailsScreen from './src/screens/RecipeDetailsScreen';
import { RecipeProvider } from './src/context/RecipeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SavedRecipesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SavedRecipes" component={SavedRecipesScreen} options={{ title: 'Saved Recipes' }} />
    <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: 'Recipe Details' }} />
  </Stack.Navigator>
);

const App = () => (
  <RecipeProvider>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Saved Recipes" component={SavedRecipesStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  </RecipeProvider>
);

export default App;