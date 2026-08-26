import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import {signOutUser} from '../backend/firebaseAuth';
import {Colors} from '../theme/colors';

export default function ProfileScreen({navigation}: {navigation: any}) {
  const user = auth().currentUser;

  const firstName =
    user?.displayName?.split(' ')[0] || 'User';

  const handleSignOut = async () => {
    await signOutUser();
    navigation.getParent()?.replace?.('Auth');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.eyebrow}>
        RENТEASE
      </Text>

      <Text style={styles.title}>
        Profile
      </Text>

      <View style={styles.profileCard}>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {firstName[0].toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.displayName || 'RentEase User'}
        </Text>

        <Text style={styles.email}>
          {user?.email || 'No email'}
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