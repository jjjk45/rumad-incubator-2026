import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing } from '../constants/colors';
import { ChatInput } from '../components/chat/ChatInput';
import { MessageList } from '../components/chat/MessageList';
import { MOCK_MESSAGES, MOCK_CONVERSATIONS } from '../constants/mockData';
import { supabase } from '../lib/supabase';
import type { Message } from '../types/chat';

interface ChatDetailScreenProps {
  chatId: string;
  onBack: () => void;
}

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
};

type ConversationRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
};

const CURRENT_MOCK_USER_ID = 'user-1';

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );

const getMockStorageKey = (chatId: string) => `mock-chat-messages:${chatId}`;

export function ChatDetailScreen({ chatId, onBack }: ChatDetailScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>(CURRENT_MOCK_USER_ID);
  const [conversation, setConversation] = useState<ConversationRow | null>(null);
  const [otherUserName, setOtherUserName] = useState('Chat');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const isMockChat = !isUuid(chatId);

  const mapMessageRowToMessage = (row: MessageRow): Message => ({
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    text: row.text,
    createdAt: row.created_at,
  });

  const loadMockChat = async () => {
    const conversationInfo = MOCK_CONVERSATIONS.find((c) => c.id === chatId);

    if (conversationInfo) {
      const otherParticipant = conversationInfo.participants.find(
        (p) => p.id !== CURRENT_MOCK_USER_ID
      );
      setOtherUserName(otherParticipant?.name || 'Mock Chat');
    } else {
      setOtherUserName('Mock Chat');
    }

    const baseMessages = MOCK_MESSAGES[chatId] || [];

    const savedMessagesRaw = await AsyncStorage.getItem(
      getMockStorageKey(chatId)
    );

    const savedMessages: Message[] = savedMessagesRaw
      ? JSON.parse(savedMessagesRaw)
      : [];

    const combined = [...savedMessages, ...baseMessages];

    const uniqueMessages = combined.filter(
      (message, index, array) =>
        array.findIndex((m) => m.id === message.id) === index
    );

    uniqueMessages.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setCurrentUserId(CURRENT_MOCK_USER_ID);
    setMessages(uniqueMessages);
  };

  const loadSupabaseChat = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw new Error(userError.message);
    if (!user) throw new Error('You must be signed in to view messages.');

    setCurrentUserId(user.id);

    const { data: conversationData, error: conversationError } = await supabase
      .from('conversations')
      .select('id, buyer_id, seller_id, listing_id')
      .eq('id', chatId)
      .maybeSingle();

    if (conversationError) throw new Error(conversationError.message);
    if (!conversationData) throw new Error('Conversation not found.');

    setConversation(conversationData as ConversationRow);

    const otherUserId =
      conversationData.buyer_id === user.id
        ? conversationData.seller_id
        : conversationData.buyer_id;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', otherUserId)
      .maybeSingle();

    if (profileData) {
      const name = `${profileData.first_name || ''} ${
        profileData.last_name || ''
      }`.trim();

      setOtherUserName(name || 'Chat');
    } else {
      setOtherUserName('Chat');
    }

    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_id, text, created_at')
      .eq('conversation_id', chatId)
      .order('created_at', { ascending: false });

    if (messageError) throw new Error(messageError.message);

    setMessages(((messageData || []) as MessageRow[]).map(mapMessageRowToMessage));
  };

  const loadChat = async () => {
    setIsLoading(true);

    try {
      if (isMockChat) {
        await loadMockChat();
      } else {
        await loadSupabaseChat();
      }
    } catch (err: any) {
      console.log('Load chat error:', err.message);
      Alert.alert('Error', err.message || 'Could not load chat.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChat();
  }, [chatId]);

  useEffect(() => {
    if (isMockChat || !chatId) return;

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = mapMessageRowToMessage(payload.new as MessageRow);

          setMessages((current) => {
            const alreadyExists = current.some((m) => m.id === newMessage.id);
            if (alreadyExists) return current;
            return [newMessage, ...current];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, isMockChat]);

  const sendMockMessage = async (text: string) => {
    const newMessage: Message = {
      id: `mock-msg-${Date.now()}`,
      conversationId: chatId,
      senderId: CURRENT_MOCK_USER_ID,
      text,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [newMessage, ...messages];

    setMessages(updatedMessages);
    setInputText('');

    const savedOnlyUserMessages = updatedMessages.filter((message) =>
      message.id.startsWith('mock-msg-')
    );

    await AsyncStorage.setItem(
      getMockStorageKey(chatId),
      JSON.stringify(savedOnlyUserMessages)
    );
  };

  const sendSupabaseMessage = async (text: string) => {
    if (!currentUserId || !conversation) {
      Alert.alert('Error', 'Chat is not ready yet.');
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: currentUserId,
        text,
      })
      .select('id, conversation_id, sender_id, text, created_at')
      .single();

    if (error) throw new Error(error.message);

    const newMessage = mapMessageRowToMessage(data as MessageRow);

    setMessages((current) => {
      const alreadyExists = current.some((m) => m.id === newMessage.id);
      if (alreadyExists) return current;
      return [newMessage, ...current];
    });

    setInputText('');

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation.id);
  };

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setIsSending(true);

    try {
      if (isMockChat) {
        await sendMockMessage(trimmedText);
      } else {
        await sendSupabaseMessage(trimmedText);
      }
    } catch (err: any) {
      console.log('Send message error:', err.message);
      Alert.alert('Error', err.message || 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{otherUserName}</Text>
          <Text style={styles.modeText}>
            {isMockChat ? 'Mock chat' : 'Live chat'}
          </Text>
          {isSending && <Text style={styles.sendingText}>Sending...</Text>}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.chatWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={styles.chatArea}>
          <MessageList messages={messages} currentUserId={currentUserId} />
        </View>

        <View style={styles.inputSafeArea}>
          <ChatInput
            value={inputText}
            onChangeText={setInputText}
            onSend={sendMessage}
          />
        </View>
      </KeyboardAvoidingView>
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
    marginRight: 56,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sendingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chatWrapper: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  inputSafeArea: {
    paddingBottom: Platform.OS === 'ios' ? 70 : 36,
    backgroundColor: Colors.background,
  },
});