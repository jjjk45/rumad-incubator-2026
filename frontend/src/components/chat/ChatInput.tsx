import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/colors';

interface ChatInputProps {
  onSend: (text: string) => void;
  value: string;
  onChangeText: (text: string) => void;
}

export function ChatInput({ onSend, value, onChangeText }: ChatInputProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
      style={styles.container}
    >
      <View style={styles.inner}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textMuted}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            if (value.trim()) {
              onSend(value);
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingBottom: 20,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontSize: 15,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
});
