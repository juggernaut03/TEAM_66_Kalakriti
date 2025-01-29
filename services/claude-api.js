// src/utils/claude-api.js
import axios from 'axios';
import { CLAUDE_API_KEY } from '../utils/index'; // Ensure this path is correct

/**
 * Processes user input using the Claude API.
 * @param {string} text - The user's input text to process.
 * @returns {Promise<string>} - The assistant's response or an error message.
 */
export const processWithClaude = async (text) => {
  try {
    console.log('Making Claude API request with text:', text);

    const response = await axios({
      method: 'post',
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2024-02-29',
        'content-type': 'application/json',
      },
      data: {
        model: 'claude-3-opus-20240229',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: text,
        }],
        system: "You are a helpful voice assistant for artisans using a mobile app. Provide clear, simple explanations focusing on their craft-related queries and app navigation help. Use simple language and brief responses.",
      },
      timeout: 10000, // 10-second timeout
    });

    console.log('Claude API Response:', response.data);

    // Extract the assistant's response from the API response
    if (response.data?.content && Array.isArray(response.data.content)) {
      return response.data.content[0]?.text || "I couldn't generate a response. Please try again.";
    } else {
      return "I couldn't understand the response from the assistant. Please try again.";
    }

  } catch (error) {
    console.error('Claude API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      stack: error.stack, // Include stack trace for debugging
    });

    // Handle specific error cases
    if (error.message === 'Network Error') {
      return "I'm having trouble connecting to the internet. Please check your connection and try again.";
    }

    if (error.response?.status === 401) {
      return "I'm sorry, there was an authentication issue. Please check your API key.";
    }

    if (error.response?.status === 429) {
      return "I'm receiving too many requests. Please wait a moment and try again.";
    }

    // Generic error message for other cases
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
};