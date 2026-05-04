import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/colors';
import { TopAppBar } from '../components/TopAppBar';
import { ConversationItem } from '../components/chat/ConversationItem';
import { MOCK_CONVERSATIONS } from '../constants/mockData';
import { BottomNavBar } from '../components/BottomNavBar';
import { supabase } from '../lib/supabase';

interface ActivityScreenProps {
  onConversationPress: (id: string) => void;
  onTabPress: (tab: any) => void;
  activeTab: string;
}

interface ListingRow {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: string | null;
  condition: string | null;
  location: string | null;
  status: string | null;
  image_url: string | null;
  is_open_to_trade: boolean | null;
  is_negotiable: boolean | null;
  created_at: string | null;
}

export function ActivityScreen({
  onConversationPress,
  onTabPress,
  activeTab,
}: ActivityScreenProps) {
  const [myListings, setMyListings] = useState<ListingRow[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMyListings = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw new Error(userError.message);

      if (!user) {
        setMyListings([]);
        return;
      }

      const { data, error } = await supabase
        .from('listings')
        .select(
          'id, seller_id, title, description, price, category, condition, location, status, image_url, is_open_to_trade, is_negotiable, created_at'
        )
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      setMyListings((data || []) as ListingRow[]);
    } catch (err: any) {
      console.log('Activity listings error:', err.message);
      setMyListings([]);
    } finally {
      setIsLoadingListings(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMyListings();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMyListings();
  };

  const deleteListing = async (listing: ListingRow) => {
    Alert.alert(
      'Delete listing?',
      `Are you sure you want to delete "${listing.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(listing.id);

            try {
              const {
                data: { user },
                error: userError,
              } = await supabase.auth.getUser();

              if (userError) throw new Error(userError.message);
              if (!user) throw new Error('You must be signed in.');

              const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', listing.id)
                .eq('seller_id', user.id);

              if (error) throw new Error(error.message);

              setMyListings((current) =>
                current.filter((item) => item.id !== listing.id)
              );

              Alert.alert('Deleted', 'Your listing was removed.');
            } catch (err: any) {
              console.log('Delete listing error:', err.message);
              Alert.alert('Error', err.message || 'Could not delete listing.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopAppBar
        showLogo
        showSearch={false}
        showNotification={false}
        showProfile={false}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Listings</Text>
            <TouchableOpacity onPress={loadMyListings}>
              <Text style={styles.seeAll}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {isLoadingListings ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" />
              <Text style={styles.loadingText}>Loading your listings...</Text>
            </View>
          ) : myListings.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No listings yet</Text>
              <Text style={styles.emptyText}>
                Items you post will show up here.
              </Text>
            </View>
          ) : (
            <View style={styles.listingsContainer}>
              {myListings.map((listing) => (
                <View key={listing.id} style={styles.listingCard}>
                  {listing.image_url ? (
                    <Image
                      source={{ uri: listing.image_url }}
                      style={styles.listingImage}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imagePlaceholderText}>🛍️</Text>
                    </View>
                  )}

                  <View style={styles.listingInfo}>
                    <View style={styles.listingTopRow}>
                      <Text style={styles.listingTitle} numberOfLines={1}>
                        {listing.title}
                      </Text>
                      <Text style={styles.listingPrice}>
                        ${Number(listing.price || 0).toFixed(2)}
                      </Text>
                    </View>

                    <Text style={styles.listingMeta} numberOfLines={1}>
                      {listing.category || 'Other'} • {listing.condition || 'Good'}
                    </Text>

                    <Text style={styles.listingMeta} numberOfLines={1}>
                      Pickup: {listing.location || 'Not set'}
                    </Text>

                    <View style={styles.cardBottomRow}>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                          {(listing.status || 'active').toUpperCase()}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteListing(listing)}
                        disabled={deletingId === listing.id}
                      >
                        <Text style={styles.deleteButtonText}>
                          {deletingId === listing.id ? 'Deleting...' : 'Delete'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavBar activeTab={activeTab as any} onTabPress={onTabPress} />
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
  listingsContainer: {
    gap: Spacing.lg,
  },
  loadingBox: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyBox: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listingImage: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
  },
  imagePlaceholder: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 32,
  },
  listingInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  listingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  listingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  listingMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(172, 44, 19, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  deleteButton: {
    backgroundColor: '#FFE5E1',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C62828',
  },
  bottomSpacing: {
    height: 100,
  },
});