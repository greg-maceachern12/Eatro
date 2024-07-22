import React from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

const RecipeInput = ({ value, onChangeText, onImageUpload, onImageRemove, image, isImageMode }) => {
  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets) {
        const source = { uri: response.assets[0].uri };
        onImageUpload(source);
      }
    });
  };

  return (
    <View style={styles.container}>
      {!isImageMode && (
        <View style={styles.inputContainer}>
          <Icon name="restaurant-outline" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            multiline
            placeholder="Paste your recipe here"
            value={value}
            onChangeText={onChangeText}
            editable={!isImageMode}
          />
        </View>
      )}
      {isImageMode ? (
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={onImageRemove}>
            <Icon name="close-circle" size={30} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Icon name="camera-outline" size={30} color="#4A90E2" />
          <Text style={styles.uploadText}>Upload Recipe Image</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  uploadText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  imageText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default RecipeInput;