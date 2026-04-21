import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing } from '../constants/colors';
import { ChatInput } from '../components/chat/ChatInput';
import { MessageList } from '../components/chat/MessageList';
import { MOCK_MESSAGES, MOCK_CONVERSATIONS } from '../constants/mockData';
import { Message } from '../types/chat';

interface ChatDetailScreenProps {
  chatId: string;
  onBack: () => void;
}

export function ChatDetailScreen({ chatId, onBack }: ChatDetailScreenProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState('');

  React.useEffect(() => {
    if (chatId) {
      const chatMessages = MOCK_MESSAGES[chatId] || [];
      setMessages([...chatMessages].reverse());
    }
  }, [chatId]);

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: chatId,
      senderId: 'user-1',
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages([newMessage, ...messages]);
    setInputText('');
  };

  const getConversationInfo = () => {
    const conv = MOCK_CONVERSATIONS.find(c => c.id === chatId);
    if (!conv) return null;

    const otherParticipant = conv.participants.find(p => p.id !== 'user-1');
    return {
      name: otherParticipant?.name || 'Unknown',
      avatar: otherParticipant?.avatarUrl || '',
    };
  };

  const info = getConversationInfo();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{info?.name}</Text>
        </View>
      </View>

      <View style={styles.chatArea}>
        <MessageList
          messages={messages}
          currentUserId="user-1"
        />
      </View>

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={sendMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chatArea: {
    flex: 1,
  },
});
