import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator to access localhost, and localhost for iOS
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export const saveUserToDatabase = async (uid: string, email: string, name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, email, name }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save user to database');
    }
    
    console.log('User saved via backend API:', data);
    return data;
  } catch (error) {
    console.error('API Error (saveUserToDatabase):', error);
    throw error;
  }
};
