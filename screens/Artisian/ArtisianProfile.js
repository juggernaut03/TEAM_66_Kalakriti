import React, { useState } from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Subheading,
  IconButton,
  Appbar,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { MaterialIcons } from '@expo/vector-icons'; // Expo Vector Icons

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [village, setVillage] = useState('');
  const [state, setState] = useState('');
  const [craft, setCraft] = useState('');
  const [experience, setExperience] = useState('');
  const [expertise, setExpertise] = useState('');
  const [awards, setAwards] = useState('');
  const [products, setProducts] = useState('');
  const [story, setStory] = useState('');
  const [image, setImage] = useState(null);

  // Load custom font
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
  });

  // Check if all fields are filled
  const isFormComplete = () => {
    return (
      name.trim() &&
      age.trim() &&
      village.trim() &&
      state.trim() &&
      craft.trim() &&
      experience.trim() &&
      expertise.trim() &&
      awards.trim() &&
      products.trim() &&
      story.trim() &&
      image
    );
  };

  const handleSave = () => {
    const profile = {
      name,
      age,
      location: { village, state },
      craft,
      experience,
      expertise,
      awards,
      products,
      story,
      image,
    };
    // Here you can handle the saving logic, e.g., send to an API or save locally
    console.log('Profile Data:', profile); // Log the profile data
    Alert.alert('Success', 'Profile completed successfully!');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!fontsLoaded) {
    return null; // Wait for fonts to load
  }

  return (
    <LinearGradient
      colors={['#F5F5DC', '#D2B48C']} // Beige and tan gradient
      style={styles.container}
    >
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="Complete My Profile"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image Upload Section */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={50} color="#8B4513" />
              </View>
            )}
          </TouchableOpacity>
          <IconButton
            icon="camera"
            size={24}
            onPress={pickImage}
            style={styles.cameraIcon}
            color="#8B4513" // Brown color
          />
        </View>

        {/* Personal Information Section */}
        <Subheading style={styles.sectionTitle}>Personal Information</Subheading>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }} // Brown theme
          left={<TextInput.Icon name="account" color="#8B4513" />}
        />
        <TextInput
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="calendar" color="#8B4513" />}
        />
        <TextInput
          label="Village"
          value={village}
          onChangeText={setVillage}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="home" color="#8B4513" />}
        />
        <TextInput
          label="State"
          value={state}
          onChangeText={setState}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="map-marker" color="#8B4513" />}
        />

        {/* Professional Information Section */}
        <Subheading style={styles.sectionTitle}>Professional Information</Subheading>
        <TextInput
          label="Craft"
          value={craft}
          onChangeText={setCraft}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="brush" color="#8B4513" />}
        />
        <TextInput
          label="Experience (in years)"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="clock" color="#8B4513" />}
        />
        <TextInput
          label="Expertise"
          value={expertise}
          onChangeText={setExpertise}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="star" color="#8B4513" />}
        />
        <TextInput
          label="Awards"
          value={awards}
          onChangeText={setAwards}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="trophy" color="#8B4513" />}
        />
        <TextInput
          label="Products"
          value={products}
          onChangeText={setProducts}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="package" color="#8B4513" />}
        />

        {/* Story Section */}
        <Subheading style={styles.sectionTitle}>Your Story</Subheading>
        <TextInput
          label="Description"
          value={story}
          onChangeText={setStory}
          multiline
          numberOfLines={4}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#8B4513', background: '#FFF' } }}
          left={<TextInput.Icon name="book" color="#8B4513" />}
        />

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          disabled={!isFormComplete()}
          labelStyle={styles.buttonLabel}
        >
          Save Profile
        </Button>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 24,
    color: '#8B4513', // Brown color
  },
  scrollContainer: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513', // Brown color
    fontFamily: 'Roboto_500Medium',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 25, // Curvy edges
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#8B4513', // Brown color
    borderRadius: 25, // Curvy edges
  },
  buttonLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#FFF',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513', // Brown border
  },
  cameraIcon: {
    position: 'absolute',
    right: 100,
    bottom: 0,
    backgroundColor: '#8B4513', // Brown color
  },
});

export default ProfilePage;