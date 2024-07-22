// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SavedRecipesScreen from './src/screens/SavedRecipesScreen';
import { RecipeProvider } from './src/context/RecipeContext';

const Tab = createBottomTabNavigator();

const App = () => (
  <RecipeProvider>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Saved Recipes" component={SavedRecipesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  </RecipeProvider>
);

export default App;