// src/screens/HomeScreen.js
import React, { useState } from "react";
import { ScrollView, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeInput from "../components/RecipeInput";
import AdjustmentsInput from "../components/AdjustmentsInput";
import AdaptButton from "../components/AdaptButton";
import AdaptedRecipe from "../components/AdaptedRecipe";
import SaveRecipeButton from "../components/SaveRecipeButton";
import { colors } from "../styles/colors";
import { useRecipes } from "../context/RecipeContext";
import { PacmanIndicator } from "react-native-indicators";

const HomeScreen = () => {
  const [recipe, setRecipe] = useState("");
  const [adjustments, setAdjustments] = useState("");
  const [adaptedRecipe, setAdaptedRecipe] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [isImageMode, setIsImageMode] = useState(false);

  const { saveRecipe } = useRecipes();

  const handleSaveRecipe = () => {
    if (adaptedRecipe) {
      saveRecipe({
        title: `Adapted Recipe (${new Date().toLocaleString()})`,
        content: adaptedRecipe,
      });
      // Optionally, show a confirmation message to the user
      alert("Recipe saved successfully!");
    }
  };
  const handleImageUpload = (source) => {
    setImage(source);
    setIsImageMode(true);
    setRecipe(""); // Clear text input when image is uploaded
  };

  const handleImageRemove = () => {
    setImage(null);
    setIsImageMode(false);
  };

  const handleAdaptRecipe = async () => {
    setIsLoading(true);
    setAdaptedRecipe(null);
    setError("");
    try {
      let requestBody = {
        adjustment: adjustments,
      };

      if (isImageMode && image) {
        // Convert image to base64
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        });
        requestBody.image = base64;
      } else {
        requestBody.recipe = recipe;
      }

      const response = await fetch(
        "https://recipequeen.azurewebsites.net/api/adjust?code=roeLI54-jI-q1rZal9YkBJsms3NKhDQj32DOKUYqkUeLAzFuv3d3UQ%3D%3D",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to adapt recipe");
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (data && data.response) {
        setAdaptedRecipe(data.response);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(
        "An error occurred while adapting the recipe. Please try again."
      );
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Adapt</Text>
        <RecipeInput
          value={recipe}
          onChangeText={setRecipe}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          image={image}
          isImageMode={isImageMode}
        />
        <AdjustmentsInput value={adjustments} onChangeText={setAdjustments} />
        <AdaptButton onPress={handleAdaptRecipe} disabled={isLoading} />
        {/* {isLoading && <PacmanIndicator color={colors.main} />} */}
        {isLoading && (
          <>
            <ActivityIndicator size="large" color={colors.main} />
            <p style={styles.loading}>This should only take a few seconds</p>
          </>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {adaptedRecipe && (
          <>
            <AdaptedRecipe recipe={adaptedRecipe} />
            <SaveRecipeButton onSave={handleSaveRecipe} disabled={false} />
          </>
        )}
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
    fontWeight: "bold",
    marginBottom: 20,
  },
  errorText: {
    color: colors.error,
    marginTop: 10,
  },
  loading: {
    textAlign: "center",
    fontSize: "0.8rem",
    fontStyle: "italic",
  },
});

export default HomeScreen;
