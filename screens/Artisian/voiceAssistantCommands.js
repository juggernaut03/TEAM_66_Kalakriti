// voiceAssistantCommands.js

// Language-specific responses
export const languageResponses = {
    'en-IN': {
      addProduct: 'Opening add product page',
      viewOrders: 'Showing your orders',
      orderStatus: 'Checking your order status',
      earnings: 'Opening earnings page',
      help: 'Here to help you',
      notUnderstood: 'Sorry, I didn\'t understand that. Please try again.',
    },
    'hi-IN': {
      addProduct: 'नया उत्पाद जोड़ने का पेज खोल रहा हूं',
      viewOrders: 'आपके ऑर्डर दिखा रहा हूं',
      orderStatus: 'ऑर्डर की स्थिति देख रहा हूं',
      earnings: 'कमाई का पेज खोल रहा हूं',
      help: 'मैं आपकी मदद के लिए हूं',
      notUnderstood: 'क्षमा करें, मैं समझ नहीं पाया। कृपया दोबारा कहें।',
    },
  };
  
  // Detailed command configurations
  export const voiceCommands = {
    navigation: {
      'add product': {
        route: 'AddProduct',
        help: {
          'en-IN': 'To add a product, speak "add product" or tap the plus button',
          'hi-IN': 'उत्पाद जोड़ने के लिए, "नया उत्पाद" बोलें',
        },
      },
      'view orders': {
        route: 'ViewOrders',
        help: {
          'en-IN': 'To view orders, say "view orders"',
          'hi-IN': 'ऑर्डर देखने के लिए, "ऑर्डर दिखाओ" बोलें',
        },
      },
      'earnings': {
        route: 'Earnings',
        help: {
          'en-IN': 'To view earnings, say "earnings"',
          'hi-IN': 'कमाई देखने के लिए, "कमाई दिखाओ" बोलें',
        },
      },
    },
    help: {
      'how to add product': {
        response: {
          'en-IN': 'To add a product: 1. Tap the plus button 2. Take photos 3. Fill in details 4. Save',
          'hi-IN': 'उत्पाद जोड़ने के लिए: 1. प्लस बटन दबाएं 2. फोटो लें 3. विवरण भरें 4. सेव करें',
        },
      },
    },
    queries: {
      'check order status': {
        handler: 'getOrderStatus',
        response: {
          'en-IN': 'Checking your order status...',
          'hi-IN': 'ऑर्डर की स्थिति जांच रहा हूं...',
        },
      },
    },
  };
  
  // Common phrases for user feedback
  export const commonPhrases = {
    listening: {
      'en-IN': 'Listening...',
      'hi-IN': 'सुन रहा हूं...',
    },
    processing: {
      'en-IN': 'Processing...',
      'hi-IN': 'समझ रहा हूं...',
    },
    error: {
      'en-IN': 'Sorry, there was an error. Please try again.',
      'hi-IN': 'क्षमा करें, कोई समस्या हुई। कृपया दोबारा कोशिश करें।',
    },
  };
  
  // Command processing function
  export const processCommand = (text, language = 'en-IN') => {
    const lowerText = text.toLowerCase();
  
    // Navigation Commands
    for (const [key, value] of Object.entries(voiceCommands.navigation)) {
      if (lowerText.includes(key)) {
        return {
          type: 'navigation',
          route: value.route,
          response: languageResponses[language][key] || value.help[language],
        };
      }
    }
  
    // Help Commands
    for (const [key, value] of Object.entries(voiceCommands.help)) {
      if (lowerText.includes(key)) {
        return {
          type: 'help',
          response: value.response[language],
        };
      }
    }
  
    // Query Commands
    for (const [key, value] of Object.entries(voiceCommands.queries)) {
      if (lowerText.includes(key)) {
        return {
          type: 'query',
          handler: value.handler,
          response: value.response[language],
        };
      }
    }
  
    // Default response if no command is matched
    return {
      type: 'unknown',
      response: languageResponses[language].notUnderstood,
    };
  };