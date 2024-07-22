// src/components/RecipeInput.js
import React from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../styles/colors';

const RecipeInput = ({ value, onChangeText, onImageUpload, onImageRemove, image, isImageMode }) => {
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
        onImageUpload(source);
      }
    });
  };

  const handleRemoveImage = () => {
    onImageRemove();
  };

  return (
    <View style={styles.container}>
      {!isImageMode && (
        <TextInput
          style={styles.input}
          multiline
          placeholder="Paste your recipe here"
          value={value}
          onChangeText={onChangeText}
          editable={!isImageMode}
        />
      )}
      {isImageMode ? (
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
            <Icon name="close-circle" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Icon name="camera-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
      {isImageMode && (
        <Text style={styles.imageText}>Image uploaded. Tap the X to remove.</Text>
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
    paddingRight: "10%",
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
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    right: -12,
    top: -12,
  },
  imageText: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.text,
  },
});

export default RecipeInput;