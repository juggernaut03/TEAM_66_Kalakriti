import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



// Import language-specific command configurations
import { 
  processCommand, 
  voiceCommands, 
  languageResponses, 
  commonPhrases 
} from './voiceAssistantCommands';

// Configuration for AI Services
const AI_SERVICES = {
  CLAUDE: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    apiKey: process.env.CLAUDE_API_KEY,
    model: 'claude-3-opus-20240229'
  },
  GEMINI: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    apiKey: process.env.GEMINI_API_KEY
  }
};

const VoiceAssistant = ({ 
  navigation, 
  onVoiceCommand, 
  mainActions = [], 
  quickCategories = [] 
}) => {
  // State Management
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState(null);
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  
  // Animation References
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Permissions and Audio Setup
  useEffect(() => {
    requestAudioPermissions();
    loadLanguagePreference();
  }, []);

  const requestAudioPermissions = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.AUDIO_RECORDING,
      Permissions.MEDIA_LIBRARY
    );
    if (status !== 'granted') {
      Alert.alert('Permissions needed', 'Audio recording permissions are required.');
    }
  };

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('voiceAssistantLanguage');
      if (savedLanguage) setSelectedLanguage(savedLanguage);
    } catch (error) {
      console.error('Language preference error:', error);
    }
  };

  // Recording Methods
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
      startListeningAnimation();
    } catch (error) {
      console.error('Recording start error:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      await transcribeAudio(uri);
    } catch (error) {
      console.error('Recording stop error:', error);
    } finally {
      setRecording(null);
      setIsListening(false);
      stopListeningAnimation();
    }
  };

  // Audio Transcription and Processing
  const transcribeAudio = async (audioUri) => {
    setIsProcessing(true);
    try {
      // Use speech-to-text API to convert audio to text
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a'
      });

      const transcriptionResponse = await axios.post(
        'YOUR_SPEECH_TO_TEXT_ENDPOINT', 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const transcribedText = transcriptionResponse.data.text;
      processVoiceCommand(transcribedText);
    } catch (error) {
      console.error('Transcription error:', error);
      speakResponse(commonPhrases.error[selectedLanguage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const processVoiceCommand = async (text) => {
    // Process command using multilingual configuration
    const commandResult = processCommand(text, selectedLanguage);

    switch(commandResult.type) {
      case 'navigation':
        navigation.navigate(commandResult.route);
        break;
      case 'help':
        speakResponse(commandResult.response);
        break;
      case 'query':
        await handleQuery(commandResult.handler);
        break;
      case 'unknown':
      default:
        await getAIAssistantResponse(text);
    }
  };

  const getAIAssistantResponse = async (query) => {
    try {
      // Hybrid AI approach using Claude and Gemini
      const [claudeResponse, geminiResponse] = await Promise.all([
        callClaudeAPI(query),
        callGeminiAPI(query)
      ]);

      // Combine or choose best response
      const finalResponse = compareAndChooseBestResponse(
        claudeResponse, 
        geminiResponse
      );

      setAssistantResponse(finalResponse);
      speakResponse(finalResponse);
    } catch (error) {
      console.error('AI Assistant error:', error);
      speakResponse(commonPhrases.error[selectedLanguage]);
    }
  };

  const callClaudeAPI = async (query) => {
    try {
      const response = await axios.post(
        AI_SERVICES.CLAUDE.endpoint,
        {
          model: AI_SERVICES.CLAUDE.model,
          messages: [{ role: 'user', content: query }],
          max_tokens: 300
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': AI_SERVICES.CLAUDE.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );
      return response.data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      return null;
    }
  };

  const callGeminiAPI = async (query) => {
    try {
      const response = await axios.post(
        `${AI_SERVICES.GEMINI.endpoint}?key=${AI_SERVICES.GEMINI.apiKey}`,
        {
          contents: [{ parts: [{ text: query }] }],
          generationConfig: { maxOutputTokens: 300 }
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return null;
    }
  };

  const compareAndChooseBestResponse = (claudeResponse, geminiResponse) => {
    // Basic comparison logic - can be enhanced
    if (claudeResponse && geminiResponse) {
      return claudeResponse.length > geminiResponse.length 
        ? claudeResponse 
        : geminiResponse;
    }
    return claudeResponse || geminiResponse || commonPhrases.error[selectedLanguage];
  };

  // Speech and Animation Methods
  const speakResponse = async (text) => {
    try {
      await Speech.speak(text, {
        language: selectedLanguage,
        pitch: 1,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const startListeningAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const stopListeningAnimation = () => {
    animatedValue.stopAnimation();
  };

  // Render Method
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.assistantButton}
        onPress={() => {
          setIsModalVisible(true);
          isListening ? stopRecording() : startRecording();
        }}
      >
        <Icon
          name={isListening ? 'microphone' : 'microphone-outline'}
          size={28}
          color="#FFF"
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Animated.View 
              style={[
                styles.microphoneIcon,
                { 
                  transform: [{ 
                    scale: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2]
                    }) 
                  }]
                }
              ]}
            >
              <Icon
                name={isListening ? 'microphone' : 'microphone-outline'}
                size={48}
                color="#8C5E58"
              />
            </Animated.View>

            {isListening && (
              <Text style={styles.listeningText}>
                {commonPhrases.listening[selectedLanguage]}
              </Text>
            )}

            {isProcessing && (
              <ActivityIndicator size="large" color="#8C5E58" />
            )}

            {assistantResponse && (
              <Text style={styles.responseText}>
                {assistantResponse}
              </Text>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setIsModalVisible(false);
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
  assistantButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
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
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  closeButton: {
   marginTop:20,
   paddingVertical :10,
   paddingHorizontal :15,
   backgroundColor:'#8C5E58',
   borderRadius :10,
   alignItems:'center'
},
closeButtonText:{
   color:'#FFF',
   fontSize :16
}
});

export default VoiceAssistant;
