import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: 1,
    title: 'Welcome to Kalakriti',
    description: 'Discover and preserve India’s traditional crafts with a modern touch.',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    background: '#FF6F61',
  },
  {
    id: 2,
    title: 'AR/VR Showcase',
    description: 'Experience artisan products in 3D with augmented reality.',
    image: 'https://images.unsplash.com/photo-1610041321327-b794c052db27?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    background: '#6B5B95',
  },
  {
    id: 3,
    title: 'E-commerce Marketplace',
    description: 'Buy unique, handcrafted products directly from rural artisans.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    background: '#88B04B',
  },
  {
    id: 4,
    title: 'Skill Development',
    description: 'Learn traditional crafts from master artisans through interactive tutorials.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
    background: '#F7CAC9',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current.scrollTo({ x: width * nextSlide, animated: true });
    } else {
      navigation.navigate('Auth'); // Navigate to the Auth screen after onboarding
    }
  };

  const handleSkip = () => {
    navigation.navigate('Auth'); // Navigate to the Auth screen
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', onboardingSlides[currentSlide].background]}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingSlides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <Image source={{ uri: slide.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.progressContainer}>
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              currentSlide === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  slide: {
    width: width - 40, // Account for padding
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCC',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});