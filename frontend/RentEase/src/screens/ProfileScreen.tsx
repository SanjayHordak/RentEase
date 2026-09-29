import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import {signOutUser} from '../backend/firebaseAuth';
import {Colors} from '../theme/colors';
import {getIdToken, getUserProfile} from '../api/apiClient';

export default function ProfileScreen({
  navigation,
}: {
  navigation: any;
}) {
  const user = auth().currentUser;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const token = await getIdToken();

      if (!token) {
        console.log('No Firebase token found');
        return;
      }

      const userProfile = await getUserProfile(token);

      console.log('User Profile:', userProfile);

      setProfile(userProfile);
    } catch (error) {
      console.log('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();

      navigation.getParent()?.replace?.('Auth');
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  // Prefer API profile name, then Firebase name
  const displayName =
    profile?.name ||
    profile?.displayName ||
    user?.displayName ||
    'User';

  const email =
    profile?.email ||
    user?.email ||
    'No email';

  return (
    <View style={styles.container}>

      <Text style={styles.eyebrow}>
        RENTЕASE
      </Text>

      <Text style={styles.title}>
        Profile
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.accent}
          />

          <Text style={styles.loadingText}>
            Loading profile...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.profileCard}>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text style={styles.name}>
              {displayName}
            </Text>

            <Text style={styles.email}>
              {email}
            </Text>

          </View>

          <Pressable style={styles.item}>
            <Text style={styles.itemText}>
              Account settings
            </Text>
          </Pressable>

          <Pressable style={styles.item}>
            <Text style={styles.itemText}>
              Saved properties
            </Text>
          </Pressable>

          <Pressable style={styles.item}>
            <Text style={styles.itemText}>
              Documents
            </Text>
          </Pressable>

          <Pressable
            style={styles.logout}
            onPress={handleSignOut}>
            <Text style={styles.logoutText}>
              Sign out
            </Text>
          </Pressable>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    padding: 20,
  },

  eyebrow: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 20,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },

  loadingText: {
    color: Colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },

  profileCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.glassBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: Colors.accent,
    fontSize: 28,
    fontWeight: '800',
  },

  name: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },

  email: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 5,
  },

  item: {
    backgroundColor: Colors.cardBg,
    borderRadius: 8,
    padding: 17,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },

  itemText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },

  logout: {
    marginTop: 25,
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});