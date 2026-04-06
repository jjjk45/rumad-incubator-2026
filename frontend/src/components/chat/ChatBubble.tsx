import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/colors';
import { Message } from '../../types/chat';

interface ChatBubbleProps {
  message: Message;
  isUser: boolean;
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <View
      style={[
        styles.bubbleContainer,
        isUser ? styles.userContainer : styles.otherContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : styles.otherText,
          ]}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: Spacing.md,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: Colors.backgroundDark,
    borderBottomLeftRadius: 0,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: Colors.white,
  },
  otherText: {
    color: Colors.textPrimary,
  },
});
