import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/colors';
import { TopAppBar } from '../components/TopAppBar';

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <TopAppBar
        showLogo
        showSearch={false}
        showNotification={false}
        showProfile={false}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Updates about messages, listings, offers, and account activity will show here.
        </Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyText}>
            When someone messages you, interacts with a listing, or sends an offer,
            you’ll see it here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 80,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1.4,
    lineHeight: 48,
  },
  subtitle: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});