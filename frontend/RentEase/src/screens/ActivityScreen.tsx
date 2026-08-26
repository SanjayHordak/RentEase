import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {Colors} from '../theme/colors';

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.eyebrow}>
          RENТEASE
        </Text>

        <Text style={styles.title}>
          Activity
        </Text>

        <Text style={styles.subtitle}>
          Recent activity and updates
        </Text>

        <View style={styles.card}>
          <Text style={styles.activityTitle}>
            Rent payment received
          </Text>

          <Text style={styles.activityText}>
            ₹12,000 received for Greenview Apartments
          </Text>

          <Text style={styles.time}>
            Today
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.activityTitle}>
            Maintenance request
          </Text>

          <Text style={styles.activityText}>
            Kitchen maintenance request is pending
          </Text>

          <Text style={styles.time}>
            Yesterday
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },

  content: {
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
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
  },

  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },

  activityTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },

  activityText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 7,
  },

  time: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 10,
  },
});