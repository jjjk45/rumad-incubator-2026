import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/colors';
import { TopAppBar } from '../components/TopAppBar';
import { supabase } from '../lib/supabase';

interface SettingsScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  university: string | null;
  class_year: string | null;
  is_verified: boolean | null;
  created_at?: string | null;
}

export function SettingsScreen({ onBack, onLogout }: SettingsScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUserInfo = async () => {
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error('No signed-in user found.');
      }

      setUserId(user.id);
      setAuthEmail(user.email || '');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(
          'id, first_name, last_name, email, university, class_year, is_verified, created_at'
        )
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(profileError.message);
      }

      setProfile((profileData || null) as Profile | null);
    } catch (err: any) {
      console.log('Settings load error:', err.message);
      Alert.alert('Error', err.message || 'Could not load settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Log out?', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);

          try {
            const { error } = await supabase.auth.signOut();

            if (error) {
              throw new Error(error.message);
            }

            onLogout?.();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not log out.');
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete account?',
      'This will permanently delete your account. Your profile and listings may also be removed. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);

            try {
              const { error } = await supabase.rpc('delete_my_account');

              if (error) {
                throw new Error(error.message);
              }

              await supabase.auth.signOut();
              Alert.alert('Account deleted', 'Your account has been deleted.');
              onLogout?.();
            } catch (err: any) {
              console.log('Delete account error:', err.message);
              Alert.alert('Error', err.message || 'Could not delete account.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const fullName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : '';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <TopAppBar
          showLogo
          showSearch={false}
          showNotification={false}
          showProfile={false}
        />

        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopAppBar
        showLogo
        showSearch={false}
        showNotification={false}
        showProfile={false}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your RU Thrift account.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Info</Text>

          <InfoRow label="Name" value={fullName || 'Not set'} />
          <InfoRow label="Email" value={profile?.email || authEmail || 'Not set'} />
          <InfoRow
            label="University"
            value={profile?.university || 'Rutgers University'}
          />
          <InfoRow label="Class Year" value={profile?.class_year || 'Not set'} />
          <InfoRow
            label="Verified"
            value={profile?.is_verified ? 'Yes' : 'No'}
          />
          <InfoRow label="User ID" value={userId || 'Not found'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Actions</Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoggingOut || isDeleting}
          >
            <Text style={styles.logoutButtonText}>
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            disabled={isLoggingOut || isDeleting}
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? 'Deleting account...' : 'Delete Account'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.warningText}>
            Deleting your account is permanent and cannot be undone.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 80,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: 15,
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  backButtonText: {
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    marginBottom: Spacing.md,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  deleteButton: {
    backgroundColor: '#FFE5E1',
    borderRadius: BorderRadius.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F2B8B5',
  },
  deleteButtonText: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: '800',
  },
  warningText: {
    marginTop: Spacing.md,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  bottomSpacing: {
    height: 100,
  },
});