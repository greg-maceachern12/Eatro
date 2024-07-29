import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import RecipeInput from "../components/RecipeInput";
import AdjustmentsInput from "../components/AdjustmentsInput";
import AdaptButton from "../components/AdaptButton";
import AdaptedRecipe from "../components/AdaptedRecipe";
import SaveRecipeButton from "../components/SaveRecipeButton";
import { colors } from "../styles/colors";
import { useRecipes } from "../context/RecipeContext";

const HomeScreen = () => {
  const [step, setStep] = useState(1);
  const [recipe, setRecipe] = useState("");
  const [adjustments, setAdjustments] = useState("");
  const [adaptedRecipe, setAdaptedRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { saveRecipe } = useRecipes();


  const handleRecipeChange = (newRecipe) => {
    setRecipe(newRecipe);
    if (error) setError("");
  };

  const handleAdjustmentsChange = (newAdjustments) => {
    setAdjustments(newAdjustments);
    if (error) setError("");
  };

  const handleImageUpload = (source) => {
    setImage(source);
    setIsImageMode(true);
    setRecipe(""); // Clear text input when image is uploaded
    if (error) setError("");
  };

  const handleImageRemove = () => {
    setImage(null);
    setIsImageMode(false);
    if (error) setError("");
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
        if (data.response.startsWith("ERROR:")) {
          handleErrorResponse(data.response);
        } else {
          setAdaptedRecipe(data.response);
          setStep(3);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      handleErrorResponse("ERROR: UNKNOWN");
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrorResponse = (errorMessage) => {
    let userMessage = "An error occurred. Please try again.";
    let targetStep = 1; // Default to recipe input step

    if (errorMessage.includes("INVALID_RECIPE")) {
      userMessage =
        "The provided text doesn't appear to be a valid recipe. Please check your input and try again.";
      targetStep = 1;
    } else if (errorMessage.includes("INVALID_ADJUSTMENT")) {
      userMessage =
        "The requested adjustment is not valid or cannot be applied to this recipe. Please try a different adjustment.";
      targetStep = 2;
    } else {
      // For unknown errors, reset to the beginning
      userMessage =
        "An unexpected error occurred. Please start over and try again.";
      targetStep = 1;
    }

    setError(userMessage);
    setStep(targetStep);

    // Clear input for the relevant step
    if (targetStep === 1) {
      setRecipe("");
      setImage(null);
      setIsImageMode(false);
    } else if (targetStep === 2) {
      setAdjustments("");
    }
  };

  const handleSaveRecipe = () => {
    if (adaptedRecipe) {
      const titleMatch = adaptedRecipe.match(/\*\*(.*?)\*\*/);
      let title = "Adapted Recipe";
      let content = adaptedRecipe;

      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
        content = adaptedRecipe.replace(/\*\*.*?\*\*/, "").trim();
      }

      const recipeToSave = {
        title: title,
        content: content,
        timestamp: new Date().toISOString(), // Add timestamp
      };
      saveRecipe(recipeToSave);
      setIsSaved(true);
      alert("Recipe saved successfully!");
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setRecipe("");
    setAdjustments("");
    setAdaptedRecipe("");
    setImage(null);
    setIsImageMode(false);
    setIsSaved(false);
    setError("");
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={[styles.step, s === step && styles.activeStep]}>
          <Text style={[styles.stepText, s === step && styles.activeStepText]}>
            {s}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Recipe Adapter</Text>
        {renderStepIndicator()}

        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle-outline" size={24} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {step === 1 && (
          <View>
            <Text style={styles.instruction}>
              Enter your recipe or upload an image:
            </Text>
            <RecipeInput
              value={recipe}
              onChangeText={handleRecipeChange}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              image={image}
              isImageMode={isImageMode}
              placeholder="Paste or type your recipe here"
            />
            <TouchableOpacity
              style={[
                styles.nextButton,
                !recipe && !image && styles.disabledButton,
              ]}
              onPress={() => setStep(2)}
              disabled={!recipe && !image}
            >
              <Text style={styles.buttonText}>Next</Text>
              <Icon name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.instruction}>
              What adjustments would you like?
            </Text>
            <AdjustmentsInput
              value={adjustments}
              onChangeText={handleAdjustmentsChange}
              placeholder="e.g., make it vegan, reduce sugar, double the recipe"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
              >
                <Icon name="arrow-back" size={20} color="#333" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <AdaptButton
                onPress={handleAdaptRecipe}
                disabled={isLoading || !adjustments}
              />
            </View>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.main} />
            <Text style={styles.loadingText}>Adapting your recipe...</Text>
          </View>
        )}

        {step === 3 && adaptedRecipe && (
          <View>
            <Text style={styles.instruction}>Your adapted recipe:</Text>
            <AdaptedRecipe recipe={adaptedRecipe} />
            <SaveRecipeButton onSave={handleSaveRecipe} disabled={false} />
            <TouchableOpacity
              style={styles.startOverButton}
              onPress={handleStartOver}
            >
              <Icon name="refresh" size={20} color="#FFF" />
              <Text style={styles.startOverButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
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
    textAlign: "center",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: colors.main,
  },
  stepText: {
    color: "#333",
    fontWeight: "bold",
  },
  activeStepText: {
    color: "#FFF",
  },
  instruction: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  nextButton: {
    backgroundColor: colors.main,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    marginRight: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backButtonText: {
    color: "#333",
    fontSize: 16,
    marginLeft: 5,
  },
  errorText: {
    color: colors.error,
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.main,
  },
  startOverButton: {
    backgroundColor: colors.main,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  startOverButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
});

export default HomeScreen;
