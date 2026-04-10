import React, { useState } from 'react';
<<<<<<< HEAD
import { supabase } from '../lib/supabase'

=======
>>>>>>> 0c005bc49c573863bbe5baabfabdcc965e67e9b0
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

const API_URL = 'https://rumad-backend-production.up.railway.app'

interface SignUpScreenProps {
  onSignUp: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    classYear: string;
  }) => void;
  onSignIn: () => void;
}

const CLASS_YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

export function SignUpScreen({ onSignUp, onSignIn }: SignUpScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classYear, setClassYear] = useState('Senior');
  const [isLoading, setIsLoading] = useState(false);
  const [showClassPicker, setShowClassPicker] = useState(false);

<<<<<<< HEAD
const handleSignUp = async () => {
  if (!firstName || !lastName || !email) {
    Alert.alert('Missing Fields', 'Please fill all fields')
    return
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (
    !normalizedEmail.endsWith('@rutgers.edu') &&
    !normalizedEmail.endsWith('@scarletmail.rutgers.edu')
  ) {
    Alert.alert('Invalid Email', 'Please use your Rutgers email')
    return
  }

  setIsLoading(true)

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) throw error

    Alert.alert('OTP Sent', 'Check your email for the verification code')

    // Move to next screen (OTP screen)
    onSignUp({
      firstName,
      lastName,
      email: normalizedEmail,
      classYear,
    })

  } catch (err: any) {
    console.log('Error:', err.message)
    Alert.alert('Error', err.message || 'Failed to send OTP')
  } finally {
    setIsLoading(false)
  }
}
=======
  // OTP state
  const [step, setStep] = useState<'signup' | 'otp'>('signup')
  const [otp, setOtp] = useState('')

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) return
    if (password !== confirmPassword) return
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          university: classYear
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setStep('otp') // Move to OTP screen on success
    } catch (err: any) {
      Alert.alert('Error', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      Alert.alert('Success! 🎉', 'Email verified!')
      await onSignUp({ firstName, lastName, email, password, classYear })
    } catch (err: any) {
      Alert.alert('Invalid Code', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // OTP Screen
  if (step === 'otp') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.otpContent}>
          <Text style={styles.otpTitle}>Check your{'\n'}email 📬</Text>
          <Text style={styles.otpSubtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.otpEmail}>{email}</Text>
          </Text>

          <TextInput
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor={Colors.textMuted}
            style={styles.otpInput}
            autoFocus
          />

          <Button
            title={isLoading ? 'Verifying...' : 'Verify'}
            onPress={handleVerifyOtp}
            disabled={isLoading || otp.length !== 6}
            fullWidth
            style={styles.createButton}
          />

          <TouchableOpacity onPress={handleSignUp} style={styles.resendButton}>
            <Text style={styles.resendText}>Didn't get a code? </Text>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep('signup')} style={styles.backButton}>
            <Text style={styles.backText}>← Back to Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }

  // Sign Up Screen (unchanged)
>>>>>>> 0c005bc49c573863bbe5baabfabdcc965e67e9b0
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
          <InputField label="First Name" placeholder="Value" value={firstName} onChangeText={setFirstName} />
          <InputField label="Last Name" placeholder="Value" value={lastName} onChangeText={setLastName} />
          <InputField label="Email" placeholder="abc123@scarletmail.rutgers.edu" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <InputField label="Password" placeholder="At least 8 characters!" value={password} onChangeText={setPassword} secureTextEntry />
          <InputField label="Confirm Password" placeholder="Must match password!" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Class Year</Text>
            <TouchableOpacity style={styles.select} onPress={() => setShowClassPicker(!showClassPicker)}>
              <Text style={styles.selectValue}>{classYear}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
            {showClassPicker && (
              <View style={styles.pickerOptions}>
                {CLASS_YEARS.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.pickerOption, classYear === year && styles.pickerOptionActive]}
                    onPress={() => { setClassYear(year); setShowClassPicker(false); }}
                  >
                    <Text style={[styles.pickerOptionText, classYear === year && styles.pickerOptionTextActive]}>
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
            disabled={isLoading || !firstName || !lastName || !email || !password || password !== confirmPassword}
            fullWidth
            style={styles.createButton}
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
  content: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: 40 },

  // OTP styles
  otpContent: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 100, paddingBottom: 40 },
  otpTitle: { fontSize: 52, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -2, lineHeight: 52, marginBottom: Spacing.lg },
  otpSubtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: Spacing.xxl, lineHeight: 24 },
  otpEmail: { fontWeight: '600', color: Colors.textPrimary },
  otpInput: {
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, padding: 16,
    fontSize: 32, textAlign: 'center', letterSpacing: 12,
    backgroundColor: Colors.white, marginBottom: Spacing.lg,
    color: Colors.textPrimary,
  },
  resendButton: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  resendText: { fontSize: 16, color: Colors.textSecondary },
  resendLink: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  backButton: { alignItems: 'center', marginTop: Spacing.lg },
  backText: { fontSize: 16, color: Colors.textMuted },

  // Existing styles
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xxl },
  headlineContainer: { flex: 1 },
  headline: { fontSize: 64, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -2.4, lineHeight: 52, textShadowColor: 'rgba(0, 0, 0, 0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4 },
  logoContainer: { width: 100, height: 100, transform: [{ rotate: '180deg' }] },
  logo: { fontSize: 80 },
  form: { gap: Spacing.lg },
  selectContainer: { width: '100%' },
  selectLabel: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.sm },
  select: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, minHeight: 48 },
  selectValue: { fontSize: 16, color: Colors.textPrimary },
  chevron: { fontSize: 12, color: Colors.textMuted },
  pickerOptions: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, marginTop: Spacing.xs, overflow: 'hidden' },
  pickerOption: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  pickerOptionActive: { backgroundColor: Colors.primaryLight },
  pickerOptionText: { fontSize: 16, color: Colors.textPrimary },
  pickerOptionTextActive: { color: Colors.primary, fontWeight: '600' },
  createButton: { marginTop: Spacing.md, ...Shadows.medium },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xxxl },
  footerText: { fontSize: 16, color: Colors.textSecondary },
  footerLink: { fontSize: 16, fontWeight: '600', color: Colors.primary },
});