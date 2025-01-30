// src/utils/permissions.js
import * as Audio from 'expo-av';

export const requestVoicePermissions = async () => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};