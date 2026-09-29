import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';

// Use 10.0.2.2 for Android emulator to access localhost, and localhost for iOS
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

/**
 * Get a fresh Firebase ID token for the currently signed-in user.
 * Forces refresh when forceRefresh is true (e.g. after sign-up).
 */
export const getIdToken = async (forceRefresh = false): Promise<string> => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  return currentUser.getIdToken(forceRefresh);
};

/** Build Authorization + JSON headers for authenticated API calls. */
const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

/**
 * GET /api/users/me — Retrieve the authenticated user's MongoDB profile.
 * Returns the user profile object, or null if no profile exists (404).
 */
export const getUserProfile = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (response.status === 404) {
      return null; // No profile yet — new user
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data.user;
  } catch (error) {
    console.error('API Error (getUserProfile):', error);
    throw error;
  }
};

/**
 * POST /api/users — Create a new MongoDB profile for the authenticated user.
 * Role is required for new users. Returns the created user profile.
 */
export const createUserProfile = async (
  token: string,
  body: { name?: string; role: 'Tenant' | 'Landlord'; profileImage?: string },
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create profile');
    }

    console.log('Profile created via backend API:', data);
    return data.user;
  } catch (error) {
    console.error('API Error (createUserProfile):', error);
    throw error;
  }
};
