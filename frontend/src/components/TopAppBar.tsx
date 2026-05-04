import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Colors, Spacing } from '../constants/colors';

interface TopAppBarProps {
  title?: string;
  showLogo?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  notificationsEnabled?: boolean;
  profileAvatarUrl?: string | null;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function TopAppBar({
  title,
  showLogo = false,
  showSearch = false,
  showNotification = false,
  showProfile = false,
  notificationsEnabled = true,
  profileAvatarUrl = null,
  onBackPress,
  onSearchPress,
  onNotificationPress,
  onProfilePress,
}: TopAppBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {onBackPress ? (
          <TouchableOpacity style={styles.button} onPress={onBackPress}>
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>
        ) : showLogo ? (
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🪑</Text>
          </View>
        ) : (
          <View style={styles.spacer} />
        )}

        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={styles.titleSpacer} />
        )}

        <View style={styles.rightActions}>
          {showSearch && (
            <TouchableOpacity
              style={styles.button}
              onPress={onSearchPress}
              activeOpacity={0.75}
            >
              <Text style={styles.buttonText}>🔍</Text>
            </TouchableOpacity>
          )}

          {showNotification && (
            <TouchableOpacity
              style={styles.button}
              onPress={onNotificationPress}
              activeOpacity={0.75}
            >
              <Text style={styles.buttonText}>
                {notificationsEnabled ? '🔔' : '🔕'}
              </Text>
            </TouchableOpacity>
          )}

          {showProfile && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={onProfilePress}
              activeOpacity={0.75}
            >
              <View style={styles.profilePlaceholder}>
                {profileAvatarUrl ? (
                  <Image
                    source={{ uri: profileAvatarUrl }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Text style={styles.profileText}>👤</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(251, 251, 226, 0.95)',
    paddingTop: 44,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    transform: [{ rotate: '180deg' }],
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  titleSpacer: {
    flex: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minWidth: 40,
    justifyContent: 'flex-end',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
  profileButton: {
    marginLeft: Spacing.xs,
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profileText: {
    fontSize: 14,
  },
  spacer: {
    width: 40,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.backgroundDark,
  },
});