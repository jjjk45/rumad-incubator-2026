import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';
import { TopAppBar } from '../components/TopAppBar';
import { supabase } from '../lib/supabase';

interface EditProfileScreenProps {
  onBack: () => void;
  onSaveSuccess?: () => void;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
}

export function EditProfileScreen({
  onBack,
  onSaveSuccess,
}: EditProfileScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');

  const loadProfile = async () => {
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw new Error(userError.message);
      if (!user) throw new Error('No signed-in user found.');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, username, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('Profile not found.');

      const profileData = data as Profile;

      setProfile(profileData);
      setFirstName(profileData.first_name || '');
      setLastName(profileData.last_name || '');
      setUsername(profileData.username || '');
      setAvatarUrl(profileData.avatar_url || null);
    } catch (err: any) {
      console.log('Load profile error:', err.message);
      Alert.alert('Error', err.message || 'Could not load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const takePhoto = async () => {
    try {
      const currentPermission = await ImagePicker.getCameraPermissionsAsync();

      let finalPermission = currentPermission;

      if (!currentPermission.granted) {
        finalPermission = await ImagePicker.requestCameraPermissionsAsync();
      }

      if (!finalPermission.granted) {
        Alert.alert(
          'Camera access needed',
          'Please enable camera access in your phone settings to take a profile picture.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setLocalImageUri(result.assets[0].uri);
      }
    } catch (err: any) {
      console.log('Camera error:', err.message);
      Alert.alert('Camera Error', err.message || 'Could not open camera.');
    }
  };

  const pickImage = async () => {
    try {
      const currentPermission =
        await ImagePicker.getMediaLibraryPermissionsAsync();

      let finalPermission = currentPermission;

      if (!currentPermission.granted) {
        finalPermission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!finalPermission.granted) {
        Alert.alert(
          'Photo access needed',
          'Please enable photo access in your phone settings to choose a profile picture.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setLocalImageUri(result.assets[0].uri);
      }
    } catch (err: any) {
      console.log('Photo picker error:', err.message);
      Alert.alert('Photo Error', err.message || 'Could not choose photo.');
    }
  };

  const uploadProfilePicture = async (uri: string, userId: string) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const fileExt = uri.split('.').pop()?.split('?')[0]?.toLowerCase() || 'jpg';
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const saveProfile = async () => {
    if (!profile) return;

    if (cleanUsername.length < 3) {
      Alert.alert('Invalid username', 'Username must be at least 3 characters.');
      return;
    }

    setIsSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;

      if (localImageUri) {
        finalAvatarUrl = await uploadProfilePicture(localImageUri, profile.id);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: cleanUsername,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw new Error(error.message);

      Alert.alert('Saved', 'Your profile was updated.');

      onSaveSuccess?.();
      onBack();
    } catch (err: any) {
      console.log('Save profile error:', err.message);
      Alert.alert('Error', err.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const previewImage = localImageUri || avatarUrl;

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
          <Text style={styles.loadingText}>Loading profile...</Text>
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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>
          Add a profile picture and choose your username.
        </Text>

        <View style={styles.avatarSection}>
          {previewImage ? (
            <Image source={{ uri: previewImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
          )}

          <View style={styles.photoButtonRow}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhoto}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoButtonSecondary}
              onPress={pickImage}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              <Text style={styles.photoButtonSecondaryText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="ex: udaya"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSaving}
            />
            <Text style={styles.helperText}>
              Your username will appear as @{cleanUsername || 'username'}.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor={Colors.textMuted}
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor={Colors.textMuted}
              editable={!isSaving}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.disabledButton]}
            onPress={saveProfile}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
  },
  content: {
    paddingTop: 80,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  avatarImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.backgroundDark,
    marginBottom: Spacing.md,
  },
  avatarPlaceholder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 52,
  },
  photoButtonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  photoButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadows.primary,
  },
  photoButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  photoButtonSecondary: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoButtonSecondaryText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 52,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  helperText: {
    marginTop: Spacing.xs,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  saveButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primary,
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  bottomSpacing: {
    height: 100,
  },
});