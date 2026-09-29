// Google Sign-In is now handled by signInWithGoogle() in firebaseAuth.ts.
// This module re-exports it for backward compatibility with AuthScreen's import.

import { signInWithGoogle } from '../backend/firebaseAuth';

export default signInWithGoogle;