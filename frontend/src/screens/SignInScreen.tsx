import React, { useState, useRef } from 'react';
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

interface SignInScreenProps {
  onSignInSuccess: () => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

const VALID_EMAIL_DOMAIN = '@scarletmail.rutgers.edu';

// ── 8-box OTP input ──────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<TextInput>(null);
  const boxes = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={otpStyles.row}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        maxLength={8}
        autoFocus
        style={otpStyles.hiddenInput}
        caretHidden
      />
      {boxes.map((i) => {
        const char = value[i] ?? '';
        const isFocused = value.length === i;
        return (
          <View
            key={i}
            style={[
              otpStyles.box,
              isFocused && otpStyles.boxFocused,
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
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  box: { width: 48, height: 56, borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  boxFocused: { borderColor: Colors.primary, borderWidth: 2 },
  boxFilled: { borderColor: Colors.textPrimary },
  boxText: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
});

// ── Main component ────────────────────────────────────────────────────────────
export function SignInScreen({
  onSignInSuccess,
  onForgotPassword,
  onCreateAccount,
}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const isValidEmail = (e: string) =>
    e.trim().toLowerCase().endsWith(VALID_EMAIL_DOMAIN);

  // Step 1: check profiles table, send OTP
  const handleRequestOtp = async () => {
    if (!isValidEmail(email)) return;
    setIsLoading(true);
    try {
      // Check user exists in 'profiles' table
      const { data, error: lookupError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (lookupError || !data) {
        Alert.alert(
          'No account found',
          "This email isn't registered. Would you like to create an account?",
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Up', onPress: onCreateAccount },
          ]
        );
        return;
      }

      // Send OTP via Supabase Auth
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
      });
      if (otpError) throw new Error(otpError.message);

      setStep('otp');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: verify OTP with Supabase Auth
  const handleVerifyOtp = async () => {
    if (otp.length !== 8) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp,
        type: 'email',
      });
      if (error) throw new Error(error.message);

      onSignInSuccess();
    } catch (err: any) {
      Alert.alert('Invalid Code', err.message);
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP screen ──────────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.otpContent}>
          <Text style={styles.otpTitle}>Check your{'\n'}email 📬</Text>
          <Text style={styles.otpSubtitle}>
            We sent a 8-digit code to{'\n'}
            <Text style={styles.otpEmail}>{email}</Text>
          </Text>

          <OtpInput value={otp} onChange={setOtp} />

          <Button
            title={isLoading ? 'Verifying...' : 'Verify & Sign In'}
            onPress={handleVerifyOtp}
            disabled={isLoading || otp.length !== 8}
            fullWidth
            style={styles.button}
          />

          <TouchableOpacity
            onPress={handleRequestOtp}
            style={styles.resendContainer}
            disabled={isLoading}
          >
            <Text style={styles.resendText}>Didn't get a code? </Text>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setStep('email'); setOtp(''); }}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Change email</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── Email screen ────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>Sign In</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🪑</Text>
          </View>
        </View>

        <View style={styles.form}>
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
            <Text style={styles.errorText}>Must be a @scarletmail.rutgers.edu address</Text>
          )}

          <Button
            title={isLoading ? 'Sending code...' : 'Send Sign-In Code'}
            onPress={handleRequestOtp}
            disabled={isLoading || !isValidEmail(email)}
            fullWidth
            style={styles.button}
          />

          <View style={styles.createAccountContainer}>
            <Text style={styles.newHere}>New here?{' '}</Text>
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
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xxxl },
  headlineContainer: { flex: 1 },
  headline: { fontSize: 64, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -2.4, lineHeight: 52, textShadowColor: 'rgba(0, 0, 0, 0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4 },
  logoContainer: { width: 100, height: 100, transform: [{ rotate: '180deg' }] },
  logo: { fontSize: 80 },
  form: { gap: Spacing.lg },
  errorText: { fontSize: 13, color: '#E53935', marginTop: -Spacing.sm, marginLeft: 2 },
  button: { marginTop: Spacing.md, ...Shadows.medium },
  createAccountContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  newHere: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  createAccount: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: Colors.primary, textDecorationLine: 'underline' },
  otpContent: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 100, paddingBottom: 40 },
  otpTitle: { fontSize: 52, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -2, lineHeight: 52, marginBottom: Spacing.lg },
  otpSubtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: Spacing.xxl, lineHeight: 24 },
  otpEmail: { fontWeight: '600', color: Colors.textPrimary },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  resendText: { fontSize: 16, color: Colors.textSecondary },
  resendLink: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  backButton: { alignItems: 'center', marginTop: Spacing.lg },
  backText: { fontSize: 16, color: Colors.textMuted },
});