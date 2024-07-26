import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen';
import SavedRecipesScreen from './src/screens/SavedRecipesScreen';
import RecipeDetailsScreen from './src/screens/RecipeDetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { RecipeProvider } from './src/context/RecipeContext';
import { colors } from './src/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Recipe Queen" component={HomeScreen} />
  </Stack.Navigator>
);

const SavedRecipesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SavedRecipes" component={SavedRecipesScreen} options={{ title: 'Saved Recipes' }} />
    <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: 'Recipe Details' }} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <RecipeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Saved Recipes') {
                iconName = focused ? 'bookmarks' : 'bookmarks-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.main,
            tabBarInactiveTintColor: colors.gray,
            tabBarStyle: [
              {
                display: "flex"
              },
              null
            ],
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Saved Recipes" component={SavedRecipesStack} />
          <Tab.Screen name="Settings" component={SettingsStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </RecipeProvider>
  </GestureHandlerRootView>
);

export default App;