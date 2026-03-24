import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';
import { TopAppBar } from '../components';
import type { Listing, Category } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeScreenProps {
  onListingPress: (listing: Listing) => void;
  onCategoryPress: (category: Category) => void;
  onSeeAllPress: () => void;
  onRandomPress: () => void;
}

const CATEGORIES: Category[] = [
  { id: '1', name: 'Books', image: '📚' },
  { id: '2', name: 'Tech', image: '💻' },
  { id: '3', name: 'Furniture', image: '🪑' },
  { id: '4', name: 'Threads', image: '👕' },
];

const FEATURED_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Ergo Student Chair',
    description: 'Comfortable ergonomic chair',
    price: 45,
    condition: 'Like New',
    category: 'Furniture',
    images: [],
    seller: { id: '1', firstName: 'Alex', lastName: 'R', email: '', university: 'Rutgers', classYear: 'Senior', rating: 4.9, reviewCount: 42, isVerified: true },
    location: 'North Campus',
    distance: '0.4 miles',
    postedAt: '2 hours ago',
    status: 'active',
    isOpenToTrade: false,
    isNegotiable: true,
    badge: 'Must Have',
  },
  {
    id: '2',
    title: 'Cool-Point Mini Fridge',
    description: 'Mini fridge for dorm',
    price: 80,
    condition: 'Good',
    category: 'Home & Kitchen',
    images: [],
    seller: { id: '2', firstName: 'Sam', lastName: 'T', email: '', university: 'Rutgers', classYear: 'Junior', rating: 4.5, reviewCount: 12, isVerified: true },
    location: 'West Commons',
    distance: '1.2 miles',
    postedAt: '5 hours ago',
    status: 'active',
    isOpenToTrade: true,
    isNegotiable: false,
    badge: 'Curated Deal',
  },
  {
    id: '3',
    title: 'Retro Task Lamp',
    description: 'Desk lamp',
    price: 15,
    condition: 'Like New',
    category: 'Home & Kitchen',
    images: [],
    seller: { id: '3', firstName: 'Jordan', lastName: 'M', email: '', university: 'Rutgers', classYear: 'Sophomore', rating: 4.7, reviewCount: 8, isVerified: true },
    location: 'Library Sq.',
    distance: '0.2 miles',
    postedAt: '1 day ago',
    status: 'active',
    isOpenToTrade: false,
    isNegotiable: false,
  },
];

const NEW_LISTINGS: Listing[] = [
  {
    id: '4',
    title: 'MacBook Pro 2021',
    description: 'Barely used, 16GB RAM, M1 chip',
    price: 750,
    condition: 'Like New',
    category: 'Tech',
    images: [],
    seller: { id: '4', firstName: 'Chris', lastName: 'L', email: '', university: 'Rutgers', classYear: 'Graduate', rating: 5.0, reviewCount: 23, isVerified: true },
    location: 'Busch Campus',
    distance: '0.8mi',
    postedAt: '30 min ago',
    status: 'active',
    isOpenToTrade: false,
    isNegotiable: true,
  },
  {
    id: '5',
    title: 'Oak Bookcase',
    description: 'Fits 30+ textbooks, sturdy',
    price: 30,
    condition: 'Good',
    category: 'Furniture',
    images: [],
    seller: { id: '5', firstName: 'Taylor', lastName: 'K', email: '', university: 'Rutgers', classYear: 'Senior', rating: 4.3, reviewCount: 15, isVerified: true },
    location: 'Livingston',
    distance: '1.1mi',
    postedAt: '2 hours ago',
    status: 'active',
    isOpenToTrade: true,
    isNegotiable: false,
  },
  {
    id: '6',
    title: 'Coffee Maker',
    description: 'Includes 10 reusable pods!',
    price: 25,
    condition: 'Fair',
    category: 'Home & Kitchen',
    images: [],
    seller: { id: '6', firstName: 'Morgan', lastName: 'P', email: '', university: 'Rutgers', classYear: 'Freshman', rating: 4.1, reviewCount: 3, isVerified: true },
    location: 'College Ave',
    distance: '0.3mi',
    postedAt: '3 hours ago',
    status: 'active',
    isOpenToTrade: false,
    isNegotiable: true,
  },
];

export function HomeScreen({
  onListingPress,
  onCategoryPress,
  onSeeAllPress,
  onRandomPress,
}: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <TopAppBar showLogo showSearch showNotification showProfile />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <View style={styles.hero}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Campus Living,{'\n'}
              Curated &{'\n'}
              Grounded.
            </Text>
            <Text style={styles.heroSubtitle}>
              The student exchange for all your dorm wants and needs
            </Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={onRandomPress}
              activeOpacity={0.8}
            >
              <Text style={styles.heroButtonText}>Random Listing</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hand-Picked Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hand-Picked Now</Text>
            <TouchableOpacity onPress={onSeeAllPress}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {FEATURED_LISTINGS.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={styles.featuredCard}
                onPress={() => onListingPress(listing)}
                activeOpacity={0.9}
              >
                <View style={styles.featuredImageContainer}>
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>🪑</Text>
                  </View>
                  {listing.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{listing.badge}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.featuredContent}>
                  <View style={styles.featuredHeader}>
                    <Text style={styles.featuredTitle} numberOfLines={1}>
                      {listing.title}
                    </Text>
                    <Text style={styles.featuredPrice}>${listing.price}</Text>
                  </View>
                  <View style={styles.featuredMeta}>
                    <Text style={styles.metaIcon}>📍</Text>
                    <Text style={styles.featuredDistance}>
                      {listing.distance} • {listing.location}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curated Categories</Text>

          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => onCategoryPress(category)}
                activeOpacity={0.8}
              >
                <View style={styles.categoryGradient} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryEmoji}>{category.image}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Newly Listed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Newly Listed</Text>
              <Text style={styles.sectionTitle}>Nearby</Text>
            </View>

            <View style={styles.filterContainer}>
              <TouchableOpacity style={[styles.filterButton, styles.filterActive]}>
                <Text style={styles.filterTextActive}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>Under{'\n'}$20</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.newListingsContainer}>
            {NEW_LISTINGS.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={styles.newListingCard}
                onPress={() => onListingPress(listing)}
                activeOpacity={0.9}
              >
                <View style={styles.newListingImage}>
                  <View style={styles.placeholderImageSmall}>
                    <Text style={styles.placeholderTextSmall}>📦</Text>
                  </View>
                </View>

                <View style={styles.newListingContent}>
                  <View>
                    <Text style={styles.newListingTitle}>{listing.title}</Text>
                    <Text style={styles.newListingDesc} numberOfLines={1}>
                      {listing.description}
                    </Text>
                  </View>

                  <View style={styles.newListingFooter}>
                    <Text style={styles.newListingPrice}>${listing.price}</Text>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>{listing.distance}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom spacing for nav bar */}
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
  },
  hero: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xxxl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxxl,
    overflow: 'hidden',
    ...Shadows.primary,
  },
  heroOverlay: {
    position: 'absolute',
    right: -80,
    bottom: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroContent: {
    maxWidth: 512,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.9,
    lineHeight: 45,
    marginBottom: Spacing.lg,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 29,
    marginBottom: Spacing.xl,
  },
  heroButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  featuredScroll: {
    paddingRight: Spacing.lg,
  },
  featuredCard: {
    width: 280,
    marginRight: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.backgroundDark,
    overflow: 'hidden',
    ...Shadows.small,
  },
  featuredImageContainer: {
    height: 280,
    position: 'relative',
  },
  placeholderImage: {
    flex: 1,
    backgroundColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 60,
  },
  badge: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  featuredContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaIcon: {
    fontSize: 12,
  },
  featuredDistance: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - Spacing.lg * 3) / 2,
    height: 128,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundDark,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  categoryGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(89, 65, 60, 0.4)',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.4,
  },
  categoryEmoji: {
    position: 'absolute',
    top: '30%',
    left: '35%',
    fontSize: 40,
    opacity: 0.3,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  filterTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  newListingsContainer: {
    gap: Spacing.xxl,
  },
  newListingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 239, 215, 0.5)',
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  newListingImage: {
    width: 128,
    height: 128,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  placeholderImageSmall: {
    flex: 1,
    backgroundColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTextSmall: {
    fontSize: 40,
  },
  newListingContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  newListingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  newListingDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  newListingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newListingPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  distanceBadge: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  distanceText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bottomSpacing: {
    height: 100,
  },
});
