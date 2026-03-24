import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';
import { InputField, Button } from '../components';

interface SignInScreenProps {
  onSignIn: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

export function SignInScreen({
  onSignIn,
  onForgotPassword,
  onCreateAccount,
}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    await onSignIn(email, password);
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>Sign In</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🪑</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="Email"
            placeholder="abc123@scarletmail.rutgers.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            placeholder="Value"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Sign In"
            onPress={handleSignIn}
            disabled={isLoading || !email || !password}
            fullWidth
            style={styles.signInButton}
          />

          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={styles.createAccountContainer}>
            <Text style={styles.newHere}>New Here?{' '}</Text>
            <TouchableOpacity onPress={onCreateAccount}>
              <Text style={styles.createAccount}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  headlineContainer: {
    flex: 1,
  },
  headline: {
    fontSize: 64,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -2.4,
    lineHeight: 52,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  logoContainer: {
    width: 100,
    height: 100,
    transform: [{ rotate: '180deg' }],
  },
  logo: {
    fontSize: 80,
  },
  form: {
    gap: Spacing.lg,
  },
  signInButton: {
    marginTop: Spacing.md,
    ...Shadows.medium,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  forgotPassword: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  newHere: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  createAccount: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
