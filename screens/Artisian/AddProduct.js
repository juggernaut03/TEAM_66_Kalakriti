import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const colors = {
  primary: '#8C5E58',
  secondary: '#D4AA7D',
  accent: '#E3B448',
  background: '#F5F2ED',
  text: '#2A2922',
  muted: '#A49B8F',
  success: '#4CAF50',
  warning: '#FFA000',
  error: '#F44336',
  white: '#FFFFFF'
};

const { width } = Dimensions.get('window');
const MAX_IMAGES = 5;
const MAX_DESCRIPTION_LENGTH = 500;
const IMAGE_WIDTH = width - 32;

const AddProductScreen = ({ navigation }) => {
  // State declarations
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    stock: '',
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  const categories = [
    { label: 'Bone artifacts ', value: 'Bone artifacts' },
    { label: 'Stone sculptures', value: 'Stone sculptures' },
    { label: 'Bidriware ', value: 'Bidriware' },
    { label: 'Paintings', value: 'Paintings' },
    { label: 'Handlooms', value: 'Handloomsork' },
    
  ];

  // Helper Functions
  const uploadImages = async (images) => {
    try {
        const uploadPromises = images.map(async (uri) => {
            const response = await fetch(uri);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result.split(',')[1] || reader.result;
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });

        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error preparing images:', error);
        throw new Error('Failed to prepare images for upload');
    }
};


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.price || isNaN(formData.price)) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.stock || !Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler Functions
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        console.log('Starting product submission...');

        const preparedImages = await uploadImages(formData.images);
        console.log(`Prepared ${preparedImages.length} images for upload`);

        const productData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          stock: parseInt(formData.stock),
          images: preparedImages
        };

        console.log('Sending request with data:', productData);

        const response = await api.post('/api/products', productData);

        console.log('Product created successfully:', response.data);

        Alert.alert(
          'Success',
          'Product added successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } catch (error) {
        console.error('Submission error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });

        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to add product. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const requestPermissions = async () => {
    try {
      if (Platform.OS !== 'web') {
        const libraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        
        setHasPermission(
          libraryResult.status === 'granted' && cameraResult.status === 'granted'
        );

        if (libraryResult.status !== 'granted' || cameraResult.status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera and gallery permissions to upload images!',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request camera permissions');
    }
  };

  const pickImage = async (useCamera = false) => {
    try {
      if (formData.images.length >= MAX_IMAGES) {
        Alert.alert('Maximum images reached', `You can only upload ${MAX_IMAGES} images`);
        return;
      }

      if (!hasPermission && Platform.OS !== 'web') {
        Alert.alert(
          'Permission Required',
          'Please grant camera and gallery permissions to upload images',
          [
            { text: 'Cancel' },
            { text: 'Settings', onPress: () => requestPermissions() }
          ]
        );
        return;
      }

      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri],
        }));
        setSelectedImageIndex(formData.images.length);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => pickImage(true),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickImage(false),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setSelectedImageIndex(null);
  };

  // Effects
  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    const requiredFields = ['name', 'category', 'price', 'description', 'stock'];
    const filledFields = requiredFields.filter(field => formData[field] !== '');
    const percentage = (filledFields.length / requiredFields.length) * 100;
    setCompletionPercentage(percentage);
  }, [formData]);

  // JSX
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
      </View>

      <ScrollView style={styles.content}>
        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          {selectedImageIndex !== null && formData.images[selectedImageIndex] ? (
            <Image
              source={{ uri: formData.images[selectedImageIndex] }}
              style={styles.selectedImage}
              resizeMode="contain"
            />
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={showImagePickerOptions}
              disabled={formData.images.length >= MAX_IMAGES}
            >
              <Icon name="add-photo-alternate" size={40} color="#666" />
              <Text style={styles.uploadButtonText}>
                Upload Images ({formData.images.length}/{MAX_IMAGES})
              </Text>
              <Text style={styles.uploadSubtext}>
                Tap to take photo or choose from gallery
              </Text>
            </TouchableOpacity>
          )}

          {formData.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailScroll}
            >
              {formData.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.selectedThumbnail,
                  ]}
                  onPress={() => setSelectedImageIndex(index)}
                >
                  <Image source={{ uri: image }} style={styles.thumbnailImage} />
                  <TouchableOpacity
                    style={styles.removeImage}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Icon name="close" size={20} color="#FFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {formData.images.length < MAX_IMAGES && (
                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={showImagePickerOptions}
                >
                  <Icon name="add-circle" size={24} color="#2196F3" />
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>

        {/* Product Name */}
        <View style={styles.inputContainer}>
          <Icon name="label" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
        </View>

        {/* Category */}
        <View style={styles.pickerContainer}>
          <Icon name="category" size={20} color="#666" style={styles.inputIcon} />
          <Picker
            selectedValue={formData.category}
            style={styles.picker}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((category) => (
              <Picker.Item
                key={category.value}
                label={category.label}
                value={category.value}
              />
            ))}
          </Picker>
          {errors.category && <Text style={styles.error}>{errors.category}</Text>}
        </View>

        {/* Price */}
        <View style={styles.inputContainer}>
          <Icon name="attach-money" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={formData.price}
            onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.error}>{errors.price}</Text>}
        </View>

        {/* Stock */}
        <View style={styles.inputContainer}>
          <Icon name="inventory" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Stock Quantity"
            value={formData.stock}
            onChangeText={(text) => setFormData(prev => ({ ...prev, stock: text }))}
            keyboardType="numeric"
          />
          {errors.stock && <Text style={styles.error}>{errors.stock}</Text>}
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Product Description"
            value={formData.description}
            onChangeText={(text) => {
              if (text.length <= MAX_DESCRIPTION_LENGTH) {
                setFormData(prev => ({ ...prev, description: text }));
              }
            }}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.charCount}>
            {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
          </Text>
          {errors.description && <Text style={styles.error}>{errors.description}</Text>}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.draftButton]}
            onPress={() => Alert.alert('Draft Saved')}
          >
            <Text style={styles.draftButtonText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              completionPercentage < 100 && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={completionPercentage < 100 || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
// Add this button temporarily to your AddProduct screen
<TouchableOpacity
  style={StyleSheet.button}
  onPress={async () => {
    if (formData.images.length > 0) {
      console.log('Test image data:', {
        originalLength: formData.images[0].length,
        preview: formData.images[0].substring(0, 100)
      });
      
      const prepared = await uploadImages([formData.images[0]]);
      console.log('Prepared image data:', {
        preparedLength: prepared[0].length,
        preview: prepared[0].substring(0, 100)
      });
    }
  }}
>
  <Text>Test Image Data</Text>
</TouchableOpacity>

// Previous styles remain the same, add these new styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 24,
    backgroundColor: colors.white,
    padding: 16,
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
  imageSection: {
    marginBottom: 24,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 6,
    elevation: 3,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addImageText: {
    color: colors.primary,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  input: {
    backgroundColor: colors.white,
    marginBottom: 16,
    borderRadius: 8,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  picker: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.muted,
    height: 50,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    elevation: 3,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  }
});


export default AddProductScreen;