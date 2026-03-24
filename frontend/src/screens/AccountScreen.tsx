import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';
import { TopAppBar } from '../components';
import type { User, Chat, Listing } from '../types';

interface AccountScreenProps {
  user: User;
  onEditProfile: () => void;
  onViewAllChats: () => void;
  onChatPress: (chat: Chat) => void;
  onListingPress: (listing: Listing) => void;
  onSettingsPress: () => void;
}

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    otherUser: { id: '2', firstName: 'Sarah', lastName: 'Jenkins', email: '', university: 'Rutgers', classYear: 'Junior', rating: 4.8, reviewCount: 23, isVerified: true },
    lastMessage: '"Sounds good, I\'ll...',
    lastMessageTime: '2 min',
    isActiveTrade: true,
    tradeStatus: 'Meeting at\nThe Yard',
    listingImage: '💻',
    unreadCount: 1,
  },
  {
    id: '2',
    otherUser: { id: '3', firstName: 'Mark', lastName: 'Thompson', email: '', university: 'Rutgers', classYear: 'Senior', rating: 4.5, reviewCount: 12, isVerified: true },
    lastMessage: 'Is the biology textbook still available?',
    lastMessageTime: 'Yesterday',
    isActiveTrade: false,
    unreadCount: 0,
  },
];

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Designer Desk Lamp',
    description: 'Mid-century modern lamp',
    price: 45,
    condition: 'Like New',
    category: 'Home & Kitchen',
    images: [],
    seller: { id: '1', firstName: 'Alex', lastName: 'Rivera', email: '', university: 'Rutgers', classYear: 'Senior', rating: 4.2, reviewCount: 15, isVerified: true },
    location: 'College Ave',
    distance: '0.2 miles',
    postedAt: '1 day ago',
    status: 'active',
    isOpenToTrade: false,
    isNegotiable: true,
  },
  {
    id: '2',
    title: 'Organic Cotton Tote Set',
    description: 'Eco-friendly tote bags',
    price: 12,
    condition: 'Like New',
    category: 'Accessories',
    images: [],
    seller: { id: '1', firstName: 'Alex', lastName: 'Rivera', email: '', university: 'Rutgers', classYear: 'Senior', rating: 4.2, reviewCount: 15, isVerified: true },
    location: 'College Ave',
    distance: '0.2 miles',
    postedAt: '3 days ago',
    status: 'active',
    isOpenToTrade: true,
    isNegotiable: false,
    badge: 'Eco Choice',
  },
];

export function AccountScreen({
  user,
  onEditProfile,
  onViewAllChats,
  onChatPress,
  onListingPress,
  onSettingsPress,
}: AccountScreenProps) {
  return (
    <View style={styles.container}>
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
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👨‍🎓</Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Alex Rivera</Text>
            <Text style={styles.userMeta}>Rutgers University • Senior</Text>

            {/* Rating & Verification */}
            <View style={styles.badgeRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>4.2</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.verifiedText}>Verified Student</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={onEditProfile}
                activeOpacity={0.8}
              >
                <View style={styles.editProfileShadow} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={onSettingsPress}
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Chats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Chats</Text>
            <TouchableOpacity onPress={onViewAllChats}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chatsContainer}>
            {MOCK_CHATS.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={[
                  styles.chatCard,
                  chat.isActiveTrade && styles.chatCardActive,
                ]}
                onPress={() => onChatPress(chat)}
                activeOpacity={0.9}
              >
                <View style={styles.chatContent}>
                  {/* Avatar */}
                  <View style={styles.chatAvatar}>
                    <Text style={styles.chatAvatarEmoji}>👩‍🎓</Text>
                  </View>

                  {/* Chat Info */}
                  <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatName}>
                        {chat.otherUser.firstName} {chat.otherUser.lastName}
                      </Text>
                      <Text style={styles.chatTime}>{chat.lastMessageTime}</Text>
                    </View>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                      {chat.lastMessage}
                    </Text>
                    {chat.isActiveTrade && chat.tradeStatus && (
                      <View style={styles.tradeStatus}>
                        <Text style={styles.tradeIcon}>📍</Text>
                        <Text style={styles.tradeStatusText}>
                          {chat.tradeStatus}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Listing Thumbnail */}
                  {chat.listingImage && (
                    <View style={styles.listingThumbnail}>
                      <Text style={styles.thumbnailEmoji}>{chat.listingImage}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* My Listings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Listings</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>➡️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listingsContainer}>
            {/* Active Listing - Large Card */}
            <TouchableOpacity
              style={styles.activeListingCard}
              onPress={() => onListingPress(MOCK_LISTINGS[0])}
              activeOpacity={0.9}
            >
              <View style={styles.activeListingImage}>
                <Text style={styles.activeListingEmoji}>💡</Text>
              </View>
              <View style={styles.activeListingOverlay}>
                <View style={styles.activeListingInfo}>
                  <Text style={styles.statusBadge}>Active</Text>
                  <Text style={styles.activeListingTitle}>
                    {MOCK_LISTINGS[0].title}
                  </Text>
                </View>
                <Text style={styles.activeListingPrice}>
                  ${MOCK_LISTINGS[0].price}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Secondary Listing - Compact Card */}
            <TouchableOpacity
              style={styles.listingCard}
              onPress={() => onListingPress(MOCK_LISTINGS[1])}
              activeOpacity={0.9}
            >
              <View style={styles.listingThumbnailSmall}>
                <Text style={styles.listingThumbnailEmoji}>👜</Text>
              </View>
              <View style={styles.listingCardContent}>
                {MOCK_LISTINGS[1].badge && (
                  <View style={styles.ecoBadge}>
                    <Text style={styles.ecoBadgeText}>
                      {MOCK_LISTINGS[1].badge}
                    </Text>
                  </View>
                )}
                <Text style={styles.listingCardTitle}>
                  {MOCK_LISTINGS[1].title}
                </Text>
                <Text style={styles.listingCardMeta}>
                  ${MOCK_LISTINGS[1].price} • 3 Offers
                </Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreIcon}>⋮</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
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
  profileSection: {
    marginBottom: Spacing.xxxl,
  },
  avatarContainer: {
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 16,
    backgroundColor: Colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-2deg' }],
    ...Shadows.medium,
  },
  avatarEmoji: {
    fontSize: 60,
  },
  userInfo: {
    gap: Spacing.sm,
  },
  userName: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  userMeta: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(172, 44, 19, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  ratingIcon: {
    fontSize: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  verifiedIcon: {
    fontSize: 14,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  editProfileButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    position: 'relative',
    ...Shadows.primary,
  },
  editProfileShadow: {
    position: 'absolute',
    inset: 0,
    borderRadius: BorderRadius.lg,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  settingsButton: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
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
  chatCard: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  chatCardActive: {
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...Shadows.medium,
  },
  chatContent: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarEmoji: {
    fontSize: 24,
  },
  chatInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chatTime: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  chatMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tradeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(172, 44, 19, 0.1)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
  },
  tradeIcon: {
    fontSize: 12,
  },
  tradeStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.275,
    textTransform: 'uppercase',
    lineHeight: 16.5,
  },
  listingThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 6,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailEmoji: {
    fontSize: 28,
  },
  listingsContainer: {
    gap: Spacing.lg,
  },
  activeListingCard: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  activeListingImage: {
    height: 160,
    backgroundColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeListingEmoji: {
    fontSize: 60,
  },
  activeListingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeListingInfo: {
    gap: Spacing.xs,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  activeListingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  activeListingPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  listingThumbnailSmall: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingThumbnailEmoji: {
    fontSize: 32,
  },
  listingCardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  ecoBadge: {
    backgroundColor: '#E1BFB8',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  ecoBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  listingCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  listingCardMeta: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  moreButton: {
    padding: Spacing.sm,
  },
  moreIcon: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  bottomSpacing: {
    height: 100,
  },
});
