import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';
import { InputField, Button } from '../components';
import { supabase } from '../lib/supabase';

const API_URL = 'https://rumad-backend-production.up.railway.app';
const OTP_LENGTH = 8;

interface SignUpScreenProps {
  onSignUp: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    classYear: string;
  }) => void;
  onSignIn: () => void;
}

const CLASS_YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const VALID_EMAIL_DOMAIN = '@scarletmail.rutgers.edu';

function OtpInput({
  value,
  onChange,
  length = OTP_LENGTH,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  const focusedBoxIndex = isFocused ? Math.min(value.length, length - 1) : -1;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={otpStyles.row}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) =>
          onChange(text.replace(/[^0-9]/g, '').slice(0, length))
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        caretHidden
        style={otpStyles.hiddenInput}
        underlineColorAndroid="transparent"
        selectionColor="transparent"
      />

      {Array.from({ length }).map((_, i) => {
        const char = value[i] ?? '';
        const isActive = focusedBoxIndex === i;

        return (
          <View
            key={i}
            style={[
              otpStyles.box,
              isActive && otpStyles.boxFocused,
              !!char && otpStyles.boxFilled,
            ]}
          >
            <Text style={otpStyles.boxText}>{char}</Text>
          </View>
        );
      })}
    </TouchableOpacity>
  );
}

const otpStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    zIndex: -1,
  },
  box: {
    width: 38,
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  boxFilled: {
    borderColor: Colors.textPrimary,
    borderWidth: 2,
  },
  boxText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export function SignUpScreen({ onSignUp, onSignIn }: SignUpScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classYear, setClassYear] = useState('Senior');
  const [isLoading, setIsLoading] = useState(false);
  const [showClassPicker, setShowClassPicker] = useState(false);

  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [otp, setOtp] = useState('');

  const isValidEmail = (value: string) =>
    value.trim().toLowerCase().endsWith(VALID_EMAIL_DOMAIN);

  const isValidPassword = (value: string) => value.trim().length >= 8;

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword;

  const handleSignUp = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          university: classYear,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setStep('otp');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      const { error: supabaseError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp,
        type: 'email',
      });

      if (supabaseError) {
        console.warn('Supabase session note:', supabaseError.message);
      }

      onSignUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        classYear,
      });
    } catch (err: any) {
      Alert.alert('Invalid Code', err.message);
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          university: classYear,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      Alert.alert('Sent!', 'A new code has been sent to your email.');
      setOtp('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        pointerEvents="box-none"
      >
        <View style={styles.otpContent}>
          <Text style={styles.otpTitle}>Check your{'\n'}email 📬</Text>
          <Text style={styles.otpSubtitle}>
            We sent an 8-digit code to{'\n'}
            <Text style={styles.otpEmail}>{email}</Text>
          </Text>

          <OtpInput value={otp} onChange={setOtp} length={OTP_LENGTH} />

          <Button
            title={isLoading ? 'Verifying...' : 'Verify'}
            onPress={handleVerifyOtp}
            disabled={isLoading || otp.length !== OTP_LENGTH}
            fullWidth
            style={styles.button}
          />

          <TouchableOpacity
            onPress={handleResend}
            style={styles.resendButton}
            disabled={isLoading}
          >
            <Text style={styles.resendText}>Didn't get a code? </Text>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setStep('signup');
              setOtp('');
            }}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back to Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>Create</Text>
            <Text style={styles.headline}>Account</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🪑</Text>
          </View>
        </View>

        <View style={styles.form}>
          <InputField
            label="First Name"
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
          />

          <InputField
            label="Last Name"
            placeholder="Smith"
            value={lastName}
            onChangeText={setLastName}
          />

          <InputField
            label="Email"
            placeholder="abc123@scarletmail.rutgers.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {email.length > 0 && !isValidEmail(email) && (
            <Text style={styles.errorText}>
              Must be a @scarletmail.rutgers.edu address
            </Text>
          )}

          <InputField
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {password.length > 0 && !isValidPassword(password) && (
            <Text style={styles.errorText}>
              Password must be at least 8 characters
            </Text>
          )}

          <InputField
            label="Confirm Password"
            placeholder="Must match password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {confirmPassword.length > 0 && password !== confirmPassword && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}

          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Class Year</Text>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setShowClassPicker(!showClassPicker)}
            >
              <Text style={styles.selectValue}>{classYear}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>

            {showClassPicker && (
              <View style={styles.pickerOptions}>
                {CLASS_YEARS.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerOption,
                      classYear === year && styles.pickerOptionActive,
                    ]}
                    onPress={() => {
                      setClassYear(year);
                      setShowClassPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        classYear === year && styles.pickerOptionTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Button
            title={isLoading ? 'Sending code...' : 'Create Account'}
            onPress={handleSignUp}
            disabled={isLoading || !isFormValid}
            fullWidth
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSignIn}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  otpContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 100,
    paddingBottom: 40,
  },
  otpTitle: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -2,
    lineHeight: 52,
    marginBottom: Spacing.lg,
  },
  otpSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },
  otpEmail: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  resendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  resendText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  resendLink: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  backButton: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  backText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
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
  errorText: {
    fontSize: 13,
    color: '#E53935',
    marginTop: -Spacing.sm,
    marginLeft: 2,
  },
  selectContainer: {
    width: '100%',
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  select: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  selectValue: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  chevron: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  pickerOptions: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  pickerOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  pickerOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  pickerOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  button: {
    marginTop: Spacing.md,
    ...Shadows.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xxxl,
  },
  footerText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});