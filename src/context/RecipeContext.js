// src/context/RecipeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Cache } from "react-native-cache";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeContext = createContext();

const cache = new Cache({
  namespace: "RecipeCache",
  policy: {
    maxEntries: 50000, // Maximum number of entries in cache
  },
  backend: AsyncStorage
});

export const RecipeProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    loadCachedRecipes();
  }, []);

  const loadCachedRecipes = async () => {
    try {
      const cachedRecipes = await cache.get('savedRecipes');
      if (cachedRecipes) {
        setSavedRecipes(cachedRecipes);
      }
    } catch (error) {
      console.error('Error loading cached recipes:', error);
    }
  };

  const saveRecipe = async (recipe) => {
    const updatedRecipes = [...savedRecipes, recipe];
    await updateSavedRecipes(updatedRecipes);
  };

  const updateSavedRecipes = async (recipes) => {
    setSavedRecipes(recipes);
    try {
      await cache.set('savedRecipes', recipes);
    } catch (error) {
      console.error('Error caching recipes:', error);
    }
  };

  return (
    <RecipeContext.Provider value={{ savedRecipes, saveRecipe, updateSavedRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);