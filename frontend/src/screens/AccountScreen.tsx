import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';
import { TopAppBar } from '../components';
import { supabase } from '../lib/supabase';

interface AccountScreenProps {
  onEditProfile: () => void;
  onSettingsPress: () => void;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  university: string | null;
  class_year: string | null;
  is_verified: boolean | null;
  username: string | null;
  avatar_url: string | null;
}

export function AccountScreen({
  onEditProfile,
  onSettingsPress,
}: AccountScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const loadAccountData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw new Error(userError.message);
      if (!user) throw new Error('No signed-in user found.');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(
          'id, first_name, last_name, email, university, class_year, is_verified, username, avatar_url'
        )
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw new Error(profileError.message);
      if (!profileData) throw new Error('Profile row was not found for this user.');

      console.log('Loaded account profile:', profileData);

      setProfile(profileData as Profile);
    } catch (err: any) {
      console.log('Account load error:', err.message);
      setErrorMessage(err.message || 'Could not load account.');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccountData();
  }, []);

  const handleToggleNotifications = () => {
    setNotificationsEnabled((current) => {
      const next = !current;

      Alert.alert(
        next ? 'Notifications enabled' : 'Notifications disabled',
        next
          ? 'You will receive RU Thrift notifications.'
          : 'You will not receive RU Thrift notifications.'
      );

      return next;
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading account...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorTitle}>Could not load profile</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={loadAccountData}>
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fullName =
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
    'RU Thrift User';

  const university = profile.university || 'Rutgers University';
  const classYear = profile.class_year || 'Student';
  const email = profile.email || 'No email found';
  const username = profile.username ? `@${profile.username}` : '@username';
  const verified = profile.is_verified === true;
  const avatarUrl = profile.avatar_url;

  return (
    <View style={styles.container}>
      <TopAppBar
        showLogo
        showSearch={false}
        showNotification
        showProfile={false}
        notificationsEnabled={notificationsEnabled}
        onNotificationPress={handleToggleNotifications}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarEmoji}>👨‍🎓</Text>
              )}
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.usernameText}>{username}</Text>

            <Text style={styles.userMeta}>
              {university} • {classYear}
            </Text>
            <Text style={styles.emailText}>{email}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>New</Text>
              </View>

              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>{verified ? '✓' : '!'}</Text>
                <Text style={styles.verifiedText}>
                  {verified ? 'Verified Student' : 'Not Verified'}
                </Text>
              </View>

              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>
                  {notificationsEnabled ? '🔔' : '🔕'}
                </Text>
                <Text style={styles.verifiedText}>
                  {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onEditProfile}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingsButton}
                onPress={onSettingsPress}
                activeOpacity={0.8}
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 80,
    paddingHorizontal: Spacing.lg,
  },
  profileSection: {
    marginBottom: Spacing.xxxl,
  },
  avatarContainer: {
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 16,
    backgroundColor: Colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-2deg' }],
    overflow: 'hidden',
    ...Shadows.medium,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  avatarEmoji: {
    fontSize: 60,
  },
  userInfo: {
    gap: Spacing.sm,
  },
  userName: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  userMeta: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  emailText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(172, 44, 19, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  ratingIcon: {
    fontSize: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  verifiedIcon: {
    fontSize: 14,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    ...Shadows.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  settingsButton: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});