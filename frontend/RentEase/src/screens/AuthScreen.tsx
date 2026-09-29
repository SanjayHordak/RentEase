import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theme/colors';
import signIn from '../signInComponents/SignIn';
import { signUpWithEmail, signInWithEmail, createGoogleUserProfile } from '../backend/firebaseAuth';

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {
  GOOGLE_SIGN_IN_CONFIGURED,
  IOS_CLIENT_ID,
  WEB_CLIENT_ID,
} from '../signInComponents/key';

if (GOOGLE_SIGN_IN_CONFIGURED) {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID || undefined,
  });
}

const {width, height} = Dimensions.get('window');

// Pending Google user awaiting role selection before profile creation
type PendingGoogleUser = {
  token: string;
  googleDisplayName: string;
  googlePhotoUrl: string;
} | null;

export default function AuthScreen({navigation}: {navigation: any}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role,setRole] = useState<"Landlord" | "Tenant">("Tenant");
  const [pendingGoogleUser, setPendingGoogleUser] = useState<PendingGoogleUser>(null);

  // Segmented control indicator
  const tabIndicatorX = useSharedValue(0);
  const [tabWidth, setTabWidth] = useState((width - 48) / 2);

  const toggleMode = useCallback(
    (loginMode: boolean) => {
      setIsLogin(loginMode);
      tabIndicatorX.value = withSpring(loginMode ? 0 : 1, {
        damping: 20,
        stiffness: 150,
      });
    },
    [tabIndicatorX],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{translateX: tabIndicatorX.value * tabWidth}],
  }));

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    if (!isLogin && !name) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Manual Login: Firebase signIn → fetch profile from backend
        const { profile } = await signInWithEmail(email, password);
        console.log('Logged in successfully, profile:', profile?.role);
        navigation.replace('MainTabs');
      } else {
        // Manual Sign Up: Firebase createUser → create profile with chosen role
        const { profile } = await signUpWithEmail(email, password, name, role);
        console.log('Signed up successfully, role:', profile?.role);
        navigation.replace('MainTabs');
      }
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Called when a new Google user picks their role
  const handleGoogleRoleSelected = async (selectedRole: 'Tenant' | 'Landlord') => {
    if (!pendingGoogleUser) return;
    setLoading(true);
    try {
      await createGoogleUserProfile(
        pendingGoogleUser.token,
        pendingGoogleUser.googleDisplayName,
        selectedRole,
        pendingGoogleUser.googlePhotoUrl,
      );
      setPendingGoogleUser(null);
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Profile Error', error.message || 'Failed to create profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientStart} />
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            
            {/* Minimal Header */}
            <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
              <View style={styles.brandContainer}>
                <View style={styles.brandDot} />
                <Text style={styles.brandText}>RentEase</Text>
              </View>
              <Text style={styles.welcomeText}>
                {isLogin ? 'Welcome Back.' : 'Get Started.'}
              </Text>
              <Text style={styles.subtitleText}>
                {isLogin ? 'Log in to your account to continue.' : 'Create an account to find your space.'}
              </Text>
            </Animated.View>

            {/* Seamless Segmented Control */}
            <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.tabContainer}
              onLayout={(e) => setTabWidth(e.nativeEvent.layout.width / 2)}>
              <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
              <TouchableOpacity style={styles.tab} onPress={() => toggleMode(true)} activeOpacity={0.8}>
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={() => toggleMode(false)} activeOpacity={0.8}>
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Dynamic Form Area */}
            <Animated.View layout={LinearTransition.springify().damping(20).stiffness(150)} style={styles.formContainer}>
              {!isLogin && (
                <Animated.View entering={FadeInDown.duration(400)} exiting={FadeOutRight.duration(300)} style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Your Name"
                    placeholderTextColor={Colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </Animated.View>
              )}
              {!isLogin && (
                <Animated.View 
                entering={FadeInDown.duration(400)} 
                style={styles.inputContainer}
                >
                  <Text style={styles.inputLabel}>IAM A</Text>
                  <View style={styles.roleContainer}>
                    <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'Tenant' && styles.roleButtonActive,
                    ]}
                    onPress={()=> setRole('Tenant')}
                    activeOpacity={0.8}>
                      <Animated.Text style={[styles.roleText, role === 'Tenant' && styles.roleTextActive]}>TENANT</Animated.Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[styles.roleButton,
                      role === 'Landlord' && styles.roleButtonActive,
                    ]}
                    onPressOut={()=>setRole('Landlord')}
                    activeOpacity={0.8}>
                      <Animated.Text style={[styles.roleText, role === 'Landlord' && styles.roleTextActive]}>LANDLORD</Animated.Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}

              <Animated.View layout={LinearTransition.springify().damping(20).stiffness(150)} style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Email"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Animated.View>

              <Animated.View layout={LinearTransition.springify().damping(20).stiffness(150)} style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, {flex: 1, borderBottomWidth: 0}]}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeBtn}>
                    <Text style={styles.eyeText}>{passwordVisible ? 'HIDE' : 'SHOW'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputBorder} />
              </Animated.View>

              {isLogin && (
                <Animated.View entering={FadeInLeft.duration(400)} exiting={FadeOutRight.duration(300)} style={styles.forgotRow}>
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View entering={FadeInUp.duration(800).delay(300)} style={styles.actionContainer}>
              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} style={styles.mainButton} disabled={loading}>
                <LinearGradient
                  colors={[Colors.btnGradientStart, Colors.btnGradientEnd]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.mainButtonGradient}>
                  {loading ? (
                    <ActivityIndicator color="#000000" />
                  ) : (
                    <Text style={styles.mainButtonText}>
                      {isLogin ? 'Log In' : 'Create Account'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerBox}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialGrid}>
                
                  <GoogleSigninButton
                      style={{ width: '100%', height: 48 }}
                      size={GoogleSigninButton.Size.Wide}
                      color={GoogleSigninButton.Color.Dark}
                      onPress={async () => {
                        try {
                          if (!GOOGLE_SIGN_IN_CONFIGURED) {
                            Alert.alert(
                              'Google Sign-In unavailable',
                              'Replace WEB_CLIENT_ID with the OAuth Web client ID ending in .apps.googleusercontent.com.',
                            );
                            return;
                          }
                          setLoading(true);
                          const result = await signIn();
                          if (!result) return; // User cancelled

                          if (result.isNewUser) {
                            // New Google user — show role selection before creating profile
                            setPendingGoogleUser({
                              token: result.token,
                              googleDisplayName: result.googleDisplayName,
                              googlePhotoUrl: result.googlePhotoUrl,
                            });
                          } else {
                            // Existing user — profile already fetched, go home
                            console.log('Google login, existing user role:', result.profile?.role);
                            navigation.replace('MainTabs');
                          }
                        } catch (error: any) {
                          const message =
                            error?.code === 10 ||
                            error?.code === '10' ||
                            error?.message?.includes('DEVELOPER_ERROR')
                              ? 'Google OAuth setup does not match this Android app. In Firebase, add package com.rentease with SHA-1 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25, then download google-services.json again.'
                              : error.message || 'Failed to sign in with Google';
                          Alert.alert('Google Sign-In Error', message);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      />
                {/* <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>Apple</Text>
                </TouchableOpacity> */}
              </View>
            </Animated.View>

            {/* Google Role Selection Overlay — shown for new Google users */}
            {pendingGoogleUser && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.googleRoleOverlay}>
                <Text style={styles.googleRoleTitle}>Almost there!</Text>
                <Text style={styles.googleRoleSubtitle}>Select your role to complete setup.</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[styles.roleButton, styles.roleButtonActive]}
                    onPress={() => handleGoogleRoleSelected('Tenant')}
                    activeOpacity={0.8}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color={Colors.textPrimary} size="small" />
                    ) : (
                      <Text style={[styles.roleText, styles.roleTextActive]}>TENANT</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleButton, styles.roleButtonActive]}
                    onPress={() => handleGoogleRoleSelected('Landlord')}
                    activeOpacity={0.8}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color={Colors.textPrimary} size="small" />
                    ) : (
                      <Text style={[styles.roleText, styles.roleTextActive]}>LANDLORD</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setPendingGoogleUser(null)}
                  style={styles.googleRoleCancelBtn}>
                  <Text style={styles.googleRoleCancelText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryDark },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },
  
  header: { marginBottom: 40 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  brandDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent, marginRight: 8 },
  brandText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  welcomeText: { color: Colors.textPrimary, fontSize: 42, fontWeight: '800', letterSpacing: -1, marginBottom: 12 },
  subtitleText: { color: Colors.textSecondary, fontSize: 16, lineHeight: 24 },

  tabContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    borderBottomWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    height: 2,
    backgroundColor: Colors.accent,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },

  formContainer: { gap: 24, marginBottom: 40 },
  inputContainer: { position: 'relative' },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  inputBorder: { height: 1, backgroundColor: Colors.inputBorder },
  eyeBtn: { padding: 8, marginLeft: 8 },
  eyeText: { color: Colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  forgotRow: { alignItems: 'flex-end', marginTop: -8 },
  forgotText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },

  actionContainer: {},
  mainButton: {
    borderRadius: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mainButtonGradient: {
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  dividerBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.inputBorder },
  dividerText: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginHorizontal: 16 },

  socialGrid: { flexDirection: 'row', gap: 16 },
  socialBtn: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
  },
  socialBtnText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  roleContainer: {
  flexDirection: 'row',
  gap: 12,
},

roleButton: {
  flex: 1,
  paddingVertical: 16,
  borderWidth: 1,
  borderColor: Colors.inputBorder,
  borderRadius: 8,
  alignItems: 'center',
  backgroundColor: Colors.inputBg,
},

roleButtonActive: {
  borderColor: Colors.accent,
  backgroundColor: Colors.inputBg,
},

roleText: {
  color: Colors.textSecondary,
  fontSize: 14,
  fontWeight: '700',
  letterSpacing: 1,
},

roleTextActive: {
  color: Colors.textPrimary,
  fontWeight: '800',
},

googleRoleOverlay: {
  marginTop: 32,
  padding: 24,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: Colors.inputBorder,
  backgroundColor: Colors.inputBg,
  alignItems: 'center',
},
googleRoleTitle: {
  color: Colors.textPrimary,
  fontSize: 22,
  fontWeight: '800',
  marginBottom: 8,
},
googleRoleSubtitle: {
  color: Colors.textSecondary,
  fontSize: 14,
  marginBottom: 20,
  textAlign: 'center',
},
googleRoleCancelBtn: {
  marginTop: 16,
  paddingVertical: 8,
  paddingHorizontal: 24,
},
googleRoleCancelText: {
  color: Colors.textMuted,
  fontSize: 14,
  fontWeight: '600',
},
});

