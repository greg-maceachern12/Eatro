// src/components/RecipeInput.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../styles/colors';

const RecipeInput = ({ value, onChangeText }) => {
  const [image, setImage] = useState(null);

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Paste your recipe here or take a photo of it."
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Icon name="camera-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
      {image && (
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
          <Icon name="checkmark-circle" size={24} color={colors.success} style={styles.checkmark} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
  },
  uploadButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  checkmark: {
    position: 'absolute',
    right: -12,
    top: -12,
  },
});

export default RecipeInput;