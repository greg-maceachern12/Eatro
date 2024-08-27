import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../styles/colors";
import { useRecipes } from "../context/RecipeContext";

const DiscoverScreen = () => {
  const [recipeQuery, setRecipeQuery] = useState("");
  const [tastePreference, setTastePreference] = useState("any");
  const [healthPreference, setHealthPreference] = useState("any");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [discoveredRecipe, setDiscoveredRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [modificationInput, setModificationInput] = useState("");
  const [showDiscoveredRecipe, setShowDiscoveredRecipe] = useState(false);

  const animatedHeight = useRef(new Animated.Value(0)).current;

  const { saveRecipe } = useRecipes();

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: showAdvancedOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showAdvancedOptions]);

  const parseRecipe = (recipeString) => {
    const lines = recipeString.split("\n");
    const title = lines[0].replace(/\*\*/g, "").trim();
    const ingredientsIndex = lines.findIndex((line) =>
      line.includes("**Ingredients**")
    );
    const instructionsIndex = lines.findIndex((line) =>
      line.includes("**Instructions**")
    );

    const ingredients = lines
      .slice(ingredientsIndex + 1, instructionsIndex)
      .map((line) => line.replace("-", "").trim());
    const instructions = lines
      .slice(instructionsIndex + 1)
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

    return {
      title,
      ingredients,
      instructions,
    };
  };

  const handleDiscoverRecipe = async () => {
    if (!recipeQuery) {
      setError("Please enter what you want to make.");
      return;
    }

    setIsLoading(true);
    setError("");
    setDiscoveredRecipe(null);
    setShowDiscoveredRecipe(false);

    try {
      const response = await fetch(
        "https://recipequeen.azurewebsites.net/api/create?code=-V4Xz_z9EAK1Z34eqSWtg6t3Vo2-gwIjbTLy3HNBCryOAzFup_aaBw%3D%3D",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe: recipeQuery,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const data = await response.json();

      if (data && data.response) {
        const parsedRecipe = parseRecipe(data.response);
        setDiscoveredRecipe(parsedRecipe);
        setShowDiscoveredRecipe(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(
        "An error occurred while discovering the recipe. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!modificationInput) {
      setError("Please enter a modification before retrying.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://recipequeen.azurewebsites.net/api/adjust?code=roeLI54-jI-q1rZal9YkBJsms3NKhDQj32DOKUYqkUeLAzFuv3d3UQ%3D%3D",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe:
              discoveredRecipe.title +
              "\n\nIngredients:\n" +
              discoveredRecipe.ingredients.join("\n") +
              "\n\nInstructions:\n" +
              discoveredRecipe.instructions.join("\n"),
            adjustment: modificationInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to adjust recipe");
      }

      const data = await response.json();

      if (data && data.response) {
        const parsedRecipe = parseRecipe(data.response);
        setDiscoveredRecipe(parsedRecipe);
        setModificationInput(""); // Clear the modification input after successful retry
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(
        "An error occurred while adjusting the recipe. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = () => {
    if (discoveredRecipe) {
      saveRecipe({
        title: discoveredRecipe.title,
        content: `Ingredients:\n${discoveredRecipe.ingredients.join(
          "\n"
        )}\n\nInstructions:\n${discoveredRecipe.instructions.join("\n")}`,
        timestamp: new Date().toISOString(),
      });
      alert("Recipe saved successfully!");
    }
  };

  const OptionButton = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOptionButton]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionButtonText,
          isSelected && styles.selectedOptionButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!showDiscoveredRecipe ? (
          <>
            <Text style={styles.title}>🍳 Eatro</Text>
            <Text style={styles.subtitle}>
              Find your next culinary adventure
            </Text>

            <View style={styles.card}>
              <Text style={styles.instruction}>What do you want to make?</Text>
              <TextInput
                style={styles.input}
                value={recipeQuery}
                onChangeText={setRecipeQuery}
                placeholder="e.g., chocolate cake, chicken curry"
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.advancedOptionsToggle}
                onPress={toggleAdvancedOptions}
              >
                <Text style={styles.advancedOptionsText}>Advanced Options</Text>
                <Icon
                  name={showAdvancedOptions ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={colors.main}
                />
              </TouchableOpacity>

              <Animated.View
                style={[
                  styles.advancedOptions,
                  {
                    maxHeight: animatedHeight.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 210],
                    }),
                  },
                ]}
              >
                <Text style={styles.optionTitle}>🧂 Flavor</Text>
                <View style={styles.optionGroup}>
                  <OptionButton
                    title="Sweet"
                    isSelected={tastePreference === "sweet"}
                    onPress={() => setTastePreference("sweet")}
                  />
                  <OptionButton
                    title="Savory"
                    isSelected={tastePreference === "savory"}
                    onPress={() => setTastePreference("savory")}
                  />
                </View>
                <Text style={styles.optionTitle}>🥦 Health</Text>
                <View style={styles.optionGroup}>
                  <OptionButton
                    title="Tasty"
                    isSelected={healthPreference === "tasty"}
                    onPress={() => setHealthPreference("tasty")}
                  />
                  <OptionButton
                    title="Healthy"
                    isSelected={healthPreference === "healthy"}
                    onPress={() => setHealthPreference("healthy")}
                  />
                </View>
              </Animated.View>

              <TouchableOpacity
                style={[
                  styles.button,
                  (!recipeQuery || isLoading) && styles.disabledButton,
                ]}
                onPress={handleDiscoverRecipe}
                disabled={!recipeQuery || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Icon name="search" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Discover Recipe</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </>
        ) : (
          <View style={styles.recipeContainer}>
            <Text style={styles.recipeTitle}>{discoveredRecipe.title}</Text>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {discoveredRecipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                • {ingredient}
              </Text>
            ))}
            <Text style={styles.sectionTitle}>Instructions:</Text>
            {discoveredRecipe.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionText}>
                {index + 1}. {instruction}
              </Text>
            ))}

            <View style={styles.modificationContainer}>
              <TextInput
                style={styles.modificationInput}
                value={modificationInput}
                onChangeText={setModificationInput}
                placeholder="Enter modifications..."
                multiline
              />
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.retryButtonText}>Retry</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveRecipe}
            >
              <Icon name="bookmark-outline" size={20} color="#FFF" />
              <Text style={styles.saveButtonText}>Save Recipe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowDiscoveredRecipe(false)}
            >
              <Icon name="arrow-back" size={20} color={colors.main} />
              <Text style={styles.backButtonText}>Back to Search</Text>
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
    fontSize: 32,
    fontWeight: "bold",
    color: colors.main,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instruction: {
    fontSize: 18,
    marginBottom: 16,
    color: colors.text,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    height: 100, // Increased height for taller text input
    textAlignVertical: "top", // Aligns text to the top in Android
  },
  picker: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.main,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    color: colors.error,
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
  },
  recipeContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  recipeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.main,
    textAlign: "center",
  },
  recipeInstructions: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.main,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  advancedOptionsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginTop: 16,
  },
  advancedOptionsText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.main,
  },
  advancedOptions: {
    overflow: "hidden",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  optionGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.main,
    marginHorizontal: 4,
    alignItems: "center",
  },
  selectedOptionButton: {
    backgroundColor: colors.main,
  },
  optionButtonText: {
    color: colors.main,
    fontWeight: "600",
  },
  selectedOptionButtonText: {
    color: "#FFF",
  },
  modificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  modificationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.main,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  retryButton: {
    backgroundColor: colors.main,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: colors.text,
  },

  ingredientText: {
    fontSize: 16,
    marginBottom: 4,
    paddingLeft: 16,
  },

  instructionText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.main,
  },

  backButtonText: {
    color: colors.main,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default DiscoverScreen;
