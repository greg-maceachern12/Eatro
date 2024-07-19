// src/services/recipeAdapterService.js
export const adaptRecipe = async (recipe, adjustments) => {
    // In a real app, this would call an AI service
    // For now, we'll just do a simple multiplication
    const factor = parseInt(adjustments) / 4; // Assuming original recipe is for 4 adjustments
    const adapted = recipe.split('\n').map(line => {
      const parts = line.split(' ');
      if (parts.length > 1 && !isNaN(parts[0])) {
        parts[0] = (parseFloat(parts[0]) * factor).toFixed(2);
      }
      return parts.join(' ');
    }).join('\n');
    
    return adapted;
  };