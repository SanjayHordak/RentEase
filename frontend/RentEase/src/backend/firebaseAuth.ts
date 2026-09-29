import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getIdToken, createUserProfile, getUserProfile } from '../api/apiClient';

// ── Manual Sign Up ──────────────────────────────────────────────────────────
// Firebase createUser → get token → create MongoDB profile with chosen role.
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: 'Tenant' | 'Landlord',
) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    
    // Update Firebase user profile with the provided name
    await userCredential.user.updateProfile({ displayName: name });
    
    const token = await getIdToken(true);

    const profile = await createUserProfile(token, { name, role });

    return { user: auth().currentUser || userCredential.user, profile };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// ── Manual Sign In ──────────────────────────────────────────────────────────
// Firebase signIn → get token → fetch existing MongoDB profile.
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const token = await getIdToken(true);

    const profile = await getUserProfile(token);

    return { user: userCredential.user, profile };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// ── Google Sign-In ──────────────────────────────────────────────────────────
// Firebase Google auth → get token → check if MongoDB profile exists.
// Returns isNewUser flag so the caller can show role selection when needed.
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (!response || !response.data) {
      return null; // User cancelled
    }

    const googleCredential = auth.GoogleAuthProvider.credential(response.data.idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;
    const token = await getIdToken(true);

    const profile = await getUserProfile(token);

    return {
      user,
      profile,
      isNewUser: profile === null,
      googlePhotoUrl: user.photoURL || response.data.user.photo || '',
      googleDisplayName: user.displayName || response.data.user.name || 'User',
      token, // Carry token forward so AuthScreen can call createUserProfile without re-fetching
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// ── Create Google User Profile ──────────────────────────────────────────────
// Called by AuthScreen after role selection for new Google users.
export const createGoogleUserProfile = async (
  token: string,
  name: string,
  role: 'Tenant' | 'Landlord',
  profileImage: string,
) => {
  return createUserProfile(token, { name, role, profileImage });
};

// ── Sign Out ────────────────────────────────────────────────────────────────
export const signOutUser = async () => {
  try {
    await auth().signOut();
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      console.log("Google Sign out failed:", e);
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};
