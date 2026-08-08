import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';

import auth from '@react-native-firebase/auth';
import { saveUserToDatabase } from '../api/apiClient';

const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response && response.data) {
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(response.data.idToken);
      
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;
      
      // Save to Backend
      await saveUserToDatabase(
        user.uid, 
        user.email || response.data.user.email, 
        user.displayName || response.data.user.name || 'User'
      );
      
      console.log('Google Sign-In Success:', user);
      return user;
    } else {
      // sign in was cancelled by user
      return null;
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          console.log('Sign in in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android only, play services not available or outdated
          console.log('Play services not available');
          break;
        default:
          console.log('Some other error happened', error);
      }
    } else {
      // an error that's not related to google sign in occurred
      console.log('Error unrelated to google sign in', error);
    }
    throw error;
  }
};
export default signIn;