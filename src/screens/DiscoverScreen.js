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
import AdaptedRecipe from "../components/AdaptedRecipe";

const DiscoverScreen = () => {
  const [recipeQuery, setRecipeQuery] = useState("");
  const [tastePreference, setTastePreference] = useState("any");
  const [healthPreference, setHealthPreference] = useState("any");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [discoveredRecipe, setDiscoveredRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [modificationInput, setModificationInput] = useState("");
  const [showAdaptedRecipe, setShowAdaptedRecipe] = useState(false);

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

  //   const lines = recipeString.split("\n");
  //   const title = lines[0].replace(/\*\*/g, "").trim();
  //   const ingredientsIndex = lines.findIndex((line) =>
  //     line.includes("**Ingredients**")
  //   );
  //   const instructionsIndex = lines.findIndex((line) =>
  //     line.includes("**Instructions**")
  //   );

  //   const ingredients = lines
  //     .slice(ingredientsIndex + 1, instructionsIndex)
  //     .map((line) => line.replace("-", "").trim());
  //   const instructions = lines
  //     .slice(instructionsIndex + 1)
  //     .map((line) => line.replace(/^\d+\.\s*/, "").trim());

  //   return {
  //     title,
  //     ingredients,
  //     instructions,
  //   };
  // };

  const handleDiscoverRecipe = async () => {
    if (!recipeQuery) {
      setError("Please enter what you want to make.");
      return;
    }

    setIsLoading(true);
    setError("");
    setDiscoveredRecipe(null);
    setShowAdaptedRecipe(false);

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
        setDiscoveredRecipe(data.response);
        setShowAdaptedRecipe(true);
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
            recipe: discoveredRecipe,
            adjustment: modificationInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to adjust recipe");
      }

      const data = await response.json();

      if (data && data.response) {
        setDiscoveredRecipe(data.response);
        setShowAdaptedRecipe(true);
        setModificationInput(""); // Clear the modification input after successful retry
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(
        "An error occurred while adjusting the recipe. Please try again."
      );
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = () => {
    if (discoveredRecipe) {
      saveRecipe(discoveredRecipe);
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
        <View style={styles.header}>
          <Text style={styles.title}>🍳 Eatro</Text>
          <Text style={styles.subtitle}>Find your next culinary adventure</Text>
        </View>
  
        {!showAdaptedRecipe ? (
          <View style={styles.card}>
            <Text style={styles.instruction}>What do you want to make?</Text>
            <TextInput
              style={styles.input}
              value={recipeQuery}
              onChangeText={setRecipeQuery}
              placeholder="e.g., A vegan chocolate cake for 3 people using raw cane sugar"
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
  
            {showAdvancedOptions && (
              <View style={styles.advancedOptions}>
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
              </View>
            )}
  
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
                  <Icon name="sparkles" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Create Recipe</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.adaptedRecipeContainer}>
            <AdaptedRecipe recipe={discoveredRecipe} />
  
            <View style={styles.modificationContainer}>
              <TextInput
                style={styles.modificationInput}
                value={modificationInput}
                onChangeText={setModificationInput}
                placeholder="Enter any modifications"
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
                  <Text style={styles.retryButtonText}>Remake</Text>
                )}
              </TouchableOpacity>
            </View>
  
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveRecipe}
              >
                <Icon name="bookmark-outline" size={20} color="#FFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
  
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowAdaptedRecipe(false)}
              >
                <Icon name="arrow-back" size={20} color={colors.main} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
  
        {error && <Text style={styles.errorText}>{error}</Text>}
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
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.main,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  advancedOptionsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
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
    marginBottom: 24,
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
  button: {
    backgroundColor: colors.main,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  adaptedRecipeContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  modificationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.main,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginRight: 12,
  },
  retryButton: {
    backgroundColor: colors.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: colors.main,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.main,
  },
  backButtonText: {
    color: colors.main,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  errorText: {
    color: colors.error,
    marginTop: 16,
    fontSize: 16,
  },
});

export default DiscoverScreen;
