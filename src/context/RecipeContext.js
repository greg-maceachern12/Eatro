// src/context/RecipeContext.js
import React, { createContext, useState, useContext } from 'react';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);

  const saveRecipe = (recipe) => {
    setSavedRecipes((prevRecipes) => [...prevRecipes, recipe]);
  };

  return (
    <RecipeContext.Provider value={{ savedRecipes, saveRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);