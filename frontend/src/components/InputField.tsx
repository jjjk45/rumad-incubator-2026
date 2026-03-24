import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/colors';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function InputField({
  label,
  error,
  helperText,
  style,
  ...props
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          error && styles.inputError,
          props.editable === false && styles.inputDisabled,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.gray400}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 48,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputDisabled: {
    backgroundColor: Colors.gray100,
    opacity: 0.6,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
