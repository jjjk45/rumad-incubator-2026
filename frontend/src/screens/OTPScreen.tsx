import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';
import { Button } from '../components';

interface OTPScreenProps {
  onVerifyOTP: (otp: string) => void;
  onBack: () => void;
  onResendOTP: () => void;
}

export function OTPScreen({ onVerifyOTP, onBack, onResendOTP }: OTPScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const textInputRefs = useRef<(TextInput | null)[]>([]);

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOTPChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      textInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => {
    Keyboard.dismiss();
    if (!otp[index] && index > 0) {
      textInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length === 6) {
      setIsLoading(true);
      await onVerifyOTP(fullOtp);
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    onResendOTP();
    setTimer(60);
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>Verify</Text>
            <Text style={styles.headline}>Email</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🪑</Text>
          </View>
        </View>

        {/* OTP Instructions */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Enter the 6-digit verification code we sent to
          </Text>
          <Text style={styles.emailText}>your email address</Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => {
                textInputRefs.current[index] = el;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOTPChange(index, value)}
              onSubmitEditing={() => handleKeyDown(index)}
              maxLength={1}
              keyboardType="number-pad"
              returnKeyType="next"
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Timer and Resend */}
        {timer === 0 ? (
          <TouchableOpacity
            onPress={handleResend}
            style={styles.resendContainer}
            activeOpacity={0.8}
          >
            <Text style={styles.resendText}>Resend code</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Resend code in {timer}s</Text>
          </View>
        )}

        {/* Verify Button */}
        <Button
          title="Verify Email"
          onPress={handleVerify}
          disabled={isLoading || otp.join('').length !== 6}
          fullWidth
          style={styles.verifyButton}
        />
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
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.primary,
  },
  headlineContainer: {
    flex: 1,
  },
  headline: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -2.4,
    lineHeight: 52,
  },
  logoContainer: {
    width: 64,
    height: 64,
    transform: [{ rotate: '180deg' }],
  },
  logo: {
    fontSize: 40,
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  otpInput: {
    width: 48,
    height: 64,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  verifyButton: {
    ...Shadows.medium,
  },
});
