import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Animated, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const GEMINI_API_KEY = '';
const GEMINI_API_URL = '';

const artisanCommands = {
  'add product': {
    route: 'AddProduct',
    response: 'Opening add product page'
  },
  'view orders': {
    route: 'ViewOrders',
    response: 'Showing your orders'
  },
  'check earnings': {
    route: 'Earnings',
    response: 'Opening earnings page'
  },
  'manage inventory': {
    route: 'Inventory',
    response: 'Opening inventory management'
  },
  'show profile': {
    route: 'Profile',
    response: 'Opening your profile'
  }
};

const GeminiVoiceAssistant = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState(null);
  const [assistantResponse, setAssistantResponse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const buttonScale = new Animated.Value(1);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Microphone permission is required for voice commands');
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsListening(true);
      startPulseAnimation();
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      await processAudioCommand(uri);
    } catch (error) {
      console.error('Stop recording error:', error);
    } finally {
      setRecording(null);
      setIsListening(false);
      stopPulseAnimation();
    }
  };

  const processAudioCommand = async (audioUri) => {
    setIsProcessing(true);
    try {
      // For demo purposes, simulating speech-to-text
      // In production, integrate with a speech-to-text service
      const transcribedText = "show orders"; // Replace with actual speech-to-text
      
      const response = await processWithGemini(transcribedText);
      handleAssistantResponse(response);
    } catch (error) {
      console.error('Processing error:', error);
      speakResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processWithGemini = async (text) => {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `Act as an artisan's assistant. Respond to: ${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I apologize, but I am having trouble understanding. Please try again.';
    }
  };

  const handleAssistantResponse = async (response) => {
    setAssistantResponse(response);
    await speakResponse(response);

    // Check for navigation commands
    const command = Object.entries(artisanCommands).find(([key]) => 
      response.toLowerCase().includes(key)
    );

    if (command) {
      const [_, action] = command;
      if (action.route) {
        navigation.navigate(action.route);
      }
    }
  };

  const speakResponse = async (text) => {
    try {
      await Speech.speak(text, {
        language: 'en-IN',
        pitch: 1,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    buttonScale.setValue(1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.assistantButton}
        onPress={() => {
          setShowModal(true);
          isListening ? stopRecording() : startRecording();
        }}
      >
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Icon
            name={isListening ? 'microphone' : 'microphone-outline'}
            size={28}
            color="#FFF"
          />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon
              name={isListening ? 'microphone' : 'microphone-outline'}
              size={48}
              color="#8C5E58"
            />
            
            {isListening && (
              <Text style={styles.listeningText}>Listening...</Text>
            )}

            {isProcessing && (
              <ActivityIndicator size="large" color="#8C5E58" />
            )}

            {assistantResponse && (
              <Text style={styles.responseText}>{assistantResponse}</Text>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowModal(false);
                setAssistantResponse('');
                if (isListening) stopRecording();
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
  assistantButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8C5E58',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  listeningText: {
    fontSize: 20,
    color: '#8C5E58',
    marginTop: 20,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#8C5E58',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default GeminiVoiceAssistant;