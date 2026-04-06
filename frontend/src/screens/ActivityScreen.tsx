import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/colors';
import { TopAppBar } from '../components/TopAppBar';
import { ConversationItem } from '../components/chat/ConversationItem';
import { MOCK_CONVERSATIONS } from '../constants/mockData';
import { BottomNavBar } from '../components/BottomNavBar';

interface ActivityScreenProps {
  onConversationPress: (id: string) => void;
  onTabPress: (tab: any) => void;
  activeTab: string;
}

export function ActivityScreen({ onConversationPress, onTabPress, activeTab }: ActivityScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <TopAppBar
        showLogo
        showSearch={false}
        showNotification
        showProfile={false}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Chats</Text>
            <TouchableOpacity onPress={() => onTabPress('Activity')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chatsContainer}>
            {MOCK_CONVERSATIONS.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onPress={() => onConversationPress(conversation.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavBar
        activeTab={activeTab as any}
        onTabPress={onTabPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 80,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  chatsContainer: {
    gap: Spacing.lg,
  },
  bottomSpacing: {
    height: 100,
  },
});
