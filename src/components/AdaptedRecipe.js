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
    const lines = recipeText.split('\n');
    let title = '';
    let ingredients = [];
    let instructions = [];
    let currentSection = '';

    lines.forEach(line => {
      if (line.startsWith('**') && line.endsWith('**')) {
        if (line.toLowerCase().includes('ingredients')) {
          currentSection = 'ingredients';
        } else if (line.toLowerCase().includes('instructions')) {
          currentSection = 'instructions';
        } else {
          title = line.replace(/\*\*/g, '').trim();
        }
      } else {
        if (currentSection === 'ingredients') {
          ingredients.push(line.trim());
        } else if (currentSection === 'instructions') {
          instructions.push(line.trim());
        }
      }
    });

    return { title, ingredients, instructions };
  };

  const { title, ingredients, instructions } = parseRecipe(recipe);

  const renderSection = (title, content) => (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content.map((item, index) => (
        <Text key={index} style={styles.recipeText}>{item}</Text>
      ))}
    </View>
  );

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
        {renderSection("Ingredients", ingredients)}
        {renderSection("Instructions", instructions)}
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
    marginTop: 16,
    marginBottom: 8,
  },
  recipeText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 4,
  },
});

export default AdaptedRecipe;