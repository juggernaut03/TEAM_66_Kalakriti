import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import api from '../../services/api';

const API_KEY = '';
const API_URL = '';

const colors = {
  primary: '#8C5E58',
  secondary: '#D4AA7D',
  accent: '#E3B448',
  text: '#2A2922',
  background: '#F5F2ED',
  muted: '#A49B8F',
};

const RequestDesign = ({ route, navigation }) => {
  const { artisanId, artisanName } = route.params;
  const user = useSelector(state => state.auth.user);

  const [formData, setFormData] = useState({
    productCategory: '',
    description: '',
    budget: '',
    timeline: '',
    additionalNotes: '',
    referenceImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const categories = [
    { label: 'Bone Artifacts', value: 'bone_artifacts' },
    { label: 'Stone Sculptures', value: 'stone_sculptures' },
    { label: 'Bidriware', value: 'bidriware' },
    { label: 'Paintings', value: 'paintings' },
    { label: 'Handlooms', value: 'handlooms' },
  ];

  const generateDescription = async () => {
    if (!formData.productCategory) {
      Alert.alert('Select Category', 'Please select a product category first');
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const prompt = `As an Indian handicrafts expert, create a detailed design request description for a ${formData.productCategory.replace('_', ' ')}. 
        Include specific details about:
        1. Traditional design elements and motifs specific to this craft
        2. Materials traditionally used in this craft
        3. Preferred crafting techniques
        4. Dimensions and scale considerations
        5. Intended use and placement
        6. Cultural significance and symbolism
        
        Format as a clear, professional request that a skilled artisan can understand.
        Keep focus on authentic Indian craftsmanship while considering modern appeal.`;

      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }
      );

      const generatedDescription = response.data.candidates[0].content.parts[0].text;
      setFormData(prev => ({
        ...prev,
        description: generatedDescription
      }));
    } catch (error) {
      console.error('Error generating description:', error);
      Alert.alert('Error', 'Failed to generate description. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const pickImage = async () => {
    try {
      if (formData.referenceImages.length >= 5) {
        Alert.alert('Limit Reached', 'You can only upload up to 5 reference images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          referenceImages: [...prev.referenceImages, result.assets[0].uri],
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.productCategory) {
      Alert.alert('Error', 'Please select a product category');
      return false;
    }
    if (!formData.description) {
      Alert.alert('Error', 'Please provide a description');
      return false;
    }
    if (!formData.budget || isNaN(formData.budget)) {
      Alert.alert('Error', 'Please enter a valid budget');
      return false;
    }
    if (!formData.timeline) {
      Alert.alert('Error', 'Please specify a timeline');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      setLoading(true);
  
      const requestData = {
        artisanId,
        ...formData,
        budget: parseFloat(formData.budget),
      };
  
      const response = await api.post('/api/customrequests', requestData);
  
      Alert.alert(
        'Success',
        'Your custom design request has been sent to the artisan',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Custom Design Request</Text>
        <Text style={styles.headerSubtitle}>Request to: {artisanName}</Text>
      </View>

      {/* Category Selection */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Product Category*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.productCategory}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, productCategory: value }))
            }
            style={styles.picker}
          >
            <Picker.Item label="Select a category" value="" />
            {categories.map((category) => (
              <Picker.Item
                key={category.value}
                label={category.label}
                value={category.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Description with AI Integration */}
      <View style={styles.formSection}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Description*</Text>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateDescription}
            disabled={isGeneratingDescription}
          >
            <Icon 
              name={isGeneratingDescription ? "hourglass-empty" : "auto-awesome"} 
              size={20} 
              color="#FFF" 
            />
            <Text style={styles.generateButtonText}>
              {isGeneratingDescription ? 'Generating...' : 'Get AI Suggestions'}
            </Text>
          </TouchableOpacity>
        </View>
        {isGeneratingDescription && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Creating design description...</Text>
          </View>
        )}
        <TextInput
          style={[styles.textArea, isGeneratingDescription && styles.textAreaDisabled]}
          multiline
          numberOfLines={6}
          placeholder="Describe your custom design requirements in detail... Or use AI to get suggestions"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          editable={!isGeneratingDescription}
        />
      </View>

      {/* Budget */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Budget (₹)*</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter your budget"
          value={formData.budget}
          onChangeText={(text) => 
            setFormData(prev => ({ ...prev, budget: text }))
          }
        />
      </View>

      {/* Timeline */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Timeline*</Text>
        <TextInput
          style={styles.input}
          placeholder="When do you need this by?"
          value={formData.timeline}
          onChangeText={(text) => 
            setFormData(prev => ({ ...prev, timeline: text }))
          }
        />
      </View>

      {/* Reference Images */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Reference Images</Text>
        <View style={styles.imagesContainer}>
          {formData.referenceImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Icon name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
          {formData.referenceImages.length < 5 && (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Icon name="add-photo-alternate" size={24} color={colors.primary} />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Additional Notes */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Any additional details or preferences..."
          value={formData.additionalNotes}
          onChangeText={(text) => 
            setFormData(prev => ({ ...prev, additionalNotes: text }))
          }
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    marginTop: 35,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
  },
  formSection: {
    padding: 16,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: colors.primary,
    fontSize: 14,
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.muted,
  },
  picker: {
    height: 50,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.muted,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.muted,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  textAreaDisabled: {
    backgroundColor: '#F5F5F5',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  addImageText: {
    color: colors.primary,
    marginTop: 4,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default RequestDesign;