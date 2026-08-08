import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { saveUserToDatabase } from '../api/apiClient';

// Manual Sign Up
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Save to Database via API
    await saveUserToDatabase(user.uid, user.email || email, name);
    
    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Manual Sign In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign Out
export const signOutUser = async () => {
  try {
    await auth().signOut();
    // Wrap in try-catch in case GoogleSignin wasn't initialized or used
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      // ignore
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};
