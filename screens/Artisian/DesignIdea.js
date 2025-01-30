
// const API_KEY = 'AIzaSyAGpWWKzH7OOhKKYfw1Pe_9vbDvALf208Q';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Replace with your actual Gemini API key
const API_KEY = ''; 
const API_URL = '';

const CRAFT_CATEGORIES = {
  'en': [
    'Pottery and Clay Work',
    'Stone Carving',
    'Bidriware',
    'Traditional Textiles',
    'Bone and Horn Craft',
    'Wood Carving'
  ],
  'hi': [
    'मिट्टी के बर्तन और मिट्टीकला',
    'पत्थर की नक्काशी',
    'बिदरी कला',
    'पारंपरिक वस्त्र',
    'हड्डी और सींग की शिल्पकला',
    'लकड़ी की नक्काशी'
  ]
};

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', icon: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', icon: '🇮🇳' }
];

const DesignIdea = () => {
  const [prompt, setPrompt] = useState('');
  const [designSteps, setDesignSteps] = useState([]);
  const [suggestedPalette, setSuggestedPalette] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(true);

  const handleGenerateDesign = async () => {
    if (!prompt.trim()) {
      Alert.alert(
        selectedLanguage === 'en' 
          ? 'Please enter a design description' 
          : 'कृपया डिज़ाइन विवरण दर्ज करें'
      );
      return;
    }

    setIsLoading(true);

    try {
      const contextMap = {
        'en': {
          context: 'As an Indian handicrafts expert, generate a design concept based on traditional techniques for:',
          instructions: `Provide a detailed response with:
1. Four specific steps using authentic techniques
2. Four traditional colors with their cultural significance

Response Format:
STEPS:
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]
4. [Step 4 description]

COLORS:
#[Color1 Hex Code] - [Color Name and Significance]
#[Color2 Hex Code] - [Color Name and Significance]
#[Color3 Hex Code] - [Color Name and Significance]
#[Color4 Hex Code] - [Color Name and Significance]`
        },
        'hi': {
          context: 'एक भारतीय हस्तशिल्प विशेषज्ञ के रूप में, निम्न के लिए पारंपरिक तकनीकों पर आधारित डिज़ाइन अवधारणा तैयार करें:',
          instructions: `विस्तृत प्रतिक्रिया दें:
1. मूल तकनीकों का उपयोग करके चार विशिष्ट चरण
2. उनके सांस्कृतिक महत्व के साथ चार पारंपरिक रंग

प्रारूप:
चरण:
1. [चरण 1 विवरण]
2. [चरण 2 विवरण]
3. [चरण 3 विवरण]
4. [चरण 4 विवरण]

रंग:
#[रंग1 हेक्स कोड] - [रंग नाम और महत्व]
#[रंग2 हेक्स कोड] - [रंग नाम और महत्व]
#[रंग3 हेक्स कोड] - [रंग नाम और महत्व]
#[रंग4 हेक्स कोड] - [रंग नाम और महत्व]`
        }
      };

      const { context, instructions } = contextMap[selectedLanguage];

      const fullPrompt = `${context} ${prompt}

${instructions}

ध्यान दें: सुझाव भारतीय शिल्प परंपराओं के प्रति सटीक और मौलिक होने चाहिए।`;

      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        }
      );

      const result = response.data.candidates[0].content.parts[0].text;

      const parseResult = (text) => {
        const steps = [];
        const colors = [];

        const stepMatches = text.match(/\d\.\s*([^\n]+)/g) || [];
        stepMatches.forEach(match => {
          const step = match.replace(/^\d\.\s*/, '').trim();
          if (step && !step.toLowerCase().includes('color') && !step.toLowerCase().includes('रंग')) {
            steps.push(step);
          }
        });

        const colorMatches = text.match(/#[0-9A-Fa-f]{6}\s*-\s*[^\n]+/g) || [];
        colorMatches.forEach(match => {
          const [hex, significance] = match.split('-').map(s => s.trim());
          if (hex && significance) {
            colors.push({
              hex: hex.trim(),
              significance: significance.trim()
            });
          }
        });

        return { 
          steps: steps.slice(0, 4), 
          colors: colors.slice(0, 4) 
        };
      };

      const { steps, colors } = parseResult(result);

      if (steps.length === 0 || colors.length === 0) {
        throw new Error('Unable to parse design details');
      }

      setDesignSteps(steps);
      setSuggestedPalette(colors);
    } catch (error) {
      console.error("Error generating design:", error);
      Alert.alert(
        selectedLanguage === 'en' ? 'Error' : 'त्रुटि',
        selectedLanguage === 'en' 
          ? 'Failed to generate design. Please try again.' 
          : 'डिज़ाइन बनाने में विफल। कृपया पुनः प्रयास करें।',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderLanguageModal = () => (
    <Modal
      visible={isLanguageModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.languageModalContainer}>
        <View style={styles.languageModalContent}>
          <Text style={styles.languageModalTitle}>
            {selectedLanguage === 'en' ? 'Select Language' : 'भाषा चुनें'}
          </Text>
          {LANGUAGE_OPTIONS.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.languageOption}
              onPress={() => {
                setSelectedLanguage(lang.code);
                setIsLanguageModalVisible(false);
              }}
            >
              <Text style={styles.languageIcon}>{lang.icon}</Text>
              <Text style={styles.languageText}>{lang.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderLanguageModal()}
      <ScrollView>
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={() => setIsLanguageModalVisible(true)}
        >
          <Text style={styles.languageButtonText}>
            {LANGUAGE_OPTIONS.find(l => l.code === selectedLanguage).icon} 
            {' '}
            {LANGUAGE_OPTIONS.find(l => l.code === selectedLanguage).name}
          </Text>
        </TouchableOpacity>

        <LinearGradient colors={['#8C5E58', '#D4AA7D']} style={styles.header}>
          <Text style={styles.headerTitle}>
            {selectedLanguage === 'en' 
              ? 'Traditional Design Guide' 
              : 'पारंपरिक डिज़ाइन मार्गदर्शक'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {selectedLanguage === 'en' 
              ? 'Get inspired by Indian crafts heritage' 
              : 'भारतीय शिल्प विरासत से प्रेरणा लें'}
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedLanguage === 'en' 
              ? 'Select Craft Category' 
              : 'शिल्प श्रेणी चुनें'}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {CRAFT_CATEGORIES[selectedLanguage].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.selectedCategoryChip
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedLanguage === 'en' 
              ? 'Describe Your Design Idea' 
              : 'अपना डिज़ाइन विचार बताएं'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              selectedLanguage === 'en' 
                ? "E.g., 'Modern Bidriware vase with peacock motifs' or 'Traditional textile pattern with contemporary colors'" 
                : "जैसे, 'मोर के डिजाइन वाला आधुनिक बिदरी का फूलदान' या 'समकालीन रंगों के साथ पारंपरिक वस्त्र पैटर्न'"
            }
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity 
            style={[styles.generateButton, isLoading && styles.generateButtonDisabled]}
            onPress={handleGenerateDesign}
            disabled={isLoading}
          >
            <Icon name={isLoading ? "hourglass-empty" : "auto-awesome"} size={24} color="#FFF" />
            <Text style={styles.generateText}>
              {isLoading 
                ? (selectedLanguage === 'en' ? 'Generating Design...' : 'डिज़ाइन तैयार हो रहा है...')
                : (selectedLanguage === 'en' ? 'Generate Design Guide' : 'डिज़ाइन मार्गदर्शक बनाएं')}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8C5E58" />
            <Text style={styles.loadingText}>
              {selectedLanguage === 'en' 
                ? 'Creating your design guide...' 
                : 'आपका डिज़ाइन मार्गदर्शक तैयार हो रहा है...'}
            </Text>
          </View>
        )}

        {designSteps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedLanguage === 'en' 
                ? 'Traditional Technique Steps' 
                : 'पारंपरिक तकनीक के चरण'}
            </Text>
            {designSteps.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {suggestedPalette.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedLanguage === 'en' 
                ? 'Traditional Color Palette' 
                : 'पारंपरिक रंग पैलेट'}
            </Text>
            <View style={styles.paletteContainer}>
              {suggestedPalette.map((color, index) => (
                <View key={index} style={styles.colorItemContainer}>
                  <View style={[styles.colorBox, { backgroundColor: color.hex }]} />
                  <Text style={styles.colorSignificance}>{color.significance}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2922',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingBottom: 12,
  },
  categoryChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#8C5E58',
  },
  selectedCategoryChip: {
    backgroundColor: '#8C5E58',
  },
  categoryText: {
    color: '#8C5E58',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#8C5E58',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#8C5E58',
    fontSize: 14,
  },
  stepContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  stepNumber: {
    backgroundColor: '#8C5E58',
    color: '#FFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#2A2922',
    lineHeight: 24,
  },
  paletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 8,
  },
  colorItemContainer: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 16,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  colorSignificance: {
    fontSize: 14,
    color: '#2A2922',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  // Language Selection Styles
  languageButton: {
    position: 'absolute', 
    top: 50, 
    right: 16, 
    zIndex: 10,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  languageButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  languageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  languageModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  languageModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2A2922',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  languageIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  languageText: {
    fontSize: 16,
    color: '#2A2922',
  }
});

export default DesignIdea;