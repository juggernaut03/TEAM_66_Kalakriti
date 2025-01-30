import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet,Platform } from 'react-native';


const colors = {
  primary: '#8C5E58',
  secondary: '#D4AA7D',
  accent: '#E3B448',
  text: '#2A2922',
  background: '#F5F2ED',
  muted: '#A49B8F',
  success: '#4CAF50',
  warning: '#FFA000',
  error: '#F44336',
  white: '#FFFFFF',
};
const EditProductScreen = ({ route, navigation }) => {
  // Get the product data from the navigation route
  const { productId } = route.params;

  // Find the product in the dummy data (replace with API call in real app)
  const product = dummyProducts.find((p) => p._id === productId);

  // State for form fields
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [stock, setStock] = useState(product?.stock.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState(product?.images || []);

  // If the product is not found, show an error message
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  // Handle image upload
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!name || !price || !stock || !description || images.length === 0) {
      Alert.alert('Error', 'Please fill all fields and upload at least one image');
      return;
    }

    // Update the product in the dummy data (replace with API call in real app)
    const updatedProduct = {
      ...product,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      images,
    };

    // Find the index of the product in the dummy data
    const productIndex = dummyProducts.findIndex((p) => p._id === productId);
    dummyProducts[productIndex] = updatedProduct;

    // Show success message and navigate back
    Alert.alert('Success', 'Product updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Product</Text>
        <View style={{ width: 30 }} /> {/* Placeholder for alignment */}
      </View>

      {/* Product Images */}
      <View style={styles.imageSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImages(images.filter((_, i) => i !== index))}
              >
                <Icon name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Icon name="add" size={30} color="#8B4513" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Product Name */}
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />

      {/* Product Price */}
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Product Stock */}
      <TextInput
        style={styles.input}
        placeholder="Stock Quantity"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      {/* Product Description */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Product Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Dummy data for products (same as in InventoryScreen)
const dummyProducts = [
  {
    _id: '1',
    name: 'Handcrafted Pot',
    price: 1200,
    stock: 5,
    images: ['https://via.placeholder.com/150'],
    description: 'A beautiful handcrafted pot.',
  },
  {
    _id: '2',
    name: 'Wooden Sculpture',
    price: 2500,
    stock: 3,
    images: ['https://via.placeholder.com/150'],
    description: 'A unique wooden sculpture.',
  },
  {
    _id: '3',
    name: 'Bidriware Art',
    price: 1800,
    stock: 10,
    images: ['https://via.placeholder.com/150'],
    description: 'Traditional Bidriware art piece.',
  },
  {
    _id: '4',
    name: 'Stone Carving',
    price: 3000,
    stock: 2,
    images: ['https://via.placeholder.com/150'],
    description: 'Exquisite stone carving.',
  },
];


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    alignContent: 'center'
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
  errorIcon: {
    marginBottom: 16,
    color: colors.error,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorMessage: {
    color: colors.error,
    fontSize: 12,
    marginTop: -16,
    marginBottom: 16,
    marginLeft: 4,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
    textAlign: 'right',
  },
  // Added specific style for category picker
  pickerContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 12,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: colors.text,
  },
  // Added visual feedback styles for touch states
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  // Added loading state styles
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: colors.primary,
    marginTop: 12,
    fontSize: 16,
  }
});
export default EditProductScreen;