import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const AdaptedRecipe = ({ recipe }) => {
  const [copied, setCopied] = useState(false);
  const [maxHeight, setMaxHeight] = useState(
    Dimensions.get("window").height * 0.7
  );

  useEffect(() => {
    const updateLayout = () => {
      setMaxHeight(Dimensions.get("window").height * 0.7);
    };

    Dimensions.addEventListener("change", updateLayout);
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  }, []);

  const handleCopy = () => {
    Clipboard.setString(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseRecipe = (recipeText) => {
    const titleMatch = recipeText.match(/\*\*(.*?)\*\*/);
    const title = titleMatch ? titleMatch[1] : "Adapted Recipe";
    const [, ...contentParts] = recipeText.split("**");
    const content = contentParts.join("").trim();

    const ingredientsMatch = content.match(
      /Ingredients([\s\S]*?)(?=Method|STEP 1|$)/i
    );
    const instructionsMatch = content.match(/(Method|STEP 1)([\s\S]*)/i);

    return {
      title,
      ingredients: ingredientsMatch ? ingredientsMatch[1].trim() : "",
      instructions: instructionsMatch ? instructionsMatch[0].trim() : "",
    };
  };

  const { title, ingredients, instructions } = parseRecipe(recipe);

  return (
    <View style={[styles.container, { maxHeight }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
          <Icon
            name={copied ? "checkmark-circle" : "copy-outline"}
            size={24}
            color="#4CAF50"
          />
          <Text style={styles.copyButtonText}>
            {copied ? "Copied!" : "Copy"}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.recipeContainer}>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        <Text style={styles.recipeText}>{ingredients}</Text>
        <Text style={styles.sectionTitle}>Instructions:</Text>
        <Text style={styles.recipeText}>{instructions}</Text>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
  },
  copyButtonText: {
    marginLeft: 4,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  recipeContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginTop: 12,
    marginBottom: 8,
  },
  recipe: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
});

export default AdaptedRecipe;
