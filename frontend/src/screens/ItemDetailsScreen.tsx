import React, { useState } from 'react';
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
import type { Listing } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ItemDetailsScreenProps {
  listing: Listing;
  onBack: () => void;
  onBuy: () => void;
  onOfferTrade: () => void;
  onViewProfile: () => void;
  onReport: () => void;
}

export function ItemDetailsScreen({
  listing,
  onBack,
  onBuy,
  onOfferTrade,
  onViewProfile,
  onReport,
}: ItemDetailsScreenProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mock images for the gallery
  const galleryImages = ['🧊', '📷', '🏷️'];

  return (
    <View style={styles.container}>
      <TopAppBar
        onBackPress={onBack}
        showSearch
        showNotification
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <View style={styles.gallery}>
          <View style={styles.mainImageContainer}>
            <View style={styles.mainImage}>
              <Text style={styles.mainImageEmoji}>🧊</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Top Rated Seller</Text>
            </View>
          </View>

          <View style={styles.thumbnailContainer}>
            {galleryImages.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnail,
                  activeImageIndex === index && styles.thumbnailActive,
                ]}
                onPress={() => setActiveImageIndex(index)}
              >
                <Text style={styles.thumbnailEmoji}>{img}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.moreOverlay}>
              <Text style={styles.moreText}>+4 More</Text>
            </View>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.detailsSection}>
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>Home & Kitchen</Text>
            </View>
            <Text style={styles.timeAgo}>• 2 hours ago</Text>
          </View>

          <Text style={styles.title}>
            Compact 3.2 Cu. Ft.{'\n'}Mini-Fridge
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>$85.00</Text>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionIcon}>⭐</Text>
              <Text style={styles.conditionText}>Like New</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Barely used for one semester.{'\n'}
            This energy-efficient mini-fridge features a small freezer
            compartment, adjustable glass shelves, and a reversible door.
            Perfect for dorm rooms or small apartments. Super quiet and fits
            up to 45 soda cans.
          </Text>
        </View>

        {/* Seller Profile */}
        <View style={styles.sellerSection}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.avatarEmoji}>👨‍🎓</Text>
            </View>
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>Alex Thompson</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.rating}>4.9</Text>
                <Text style={styles.reviews}>(42 reviews)</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.viewProfileButton} onPress={onViewProfile}>
            <Text style={styles.viewProfileText}>View{'\n'}Profile</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Card */}
        <View style={styles.ctaCard}>
          <View style={styles.totalPrice}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalAmount}>$85.00</Text>
          </View>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={onBuy}
            activeOpacity={0.8}
          >
            <View style={styles.buyButtonShadow} />
            <Text style={styles.buyIcon}>💳</Text>
            <Text style={styles.buyButtonText}>Buy for $85</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tradeButton}
            onPress={onOfferTrade}
            activeOpacity={0.8}
          >
            <Text style={styles.tradeIcon}>🔄</Text>
            <Text style={styles.tradeButtonText}>Offer Trade</Text>
          </TouchableOpacity>

          <View style={styles.verificationList}>
            <View style={styles.verificationItem}>
              <Text style={styles.verificationIcon}>📍</Text>
              <Text style={styles.verificationText}>Katzenbach Hall</Text>
            </View>
            <View style={styles.verificationItem}>
              <Text style={styles.verificationIcon}>✓</Text>
              <Text style={styles.verificationText}>Verified Student Listing</Text>
            </View>
          </View>
        </View>

        {/* Report Button */}
        <TouchableOpacity style={styles.reportButton} onPress={onReport}>
          <Text style={styles.reportIcon}>🚩</Text>
          <Text style={styles.reportText}>Report this listing</Text>
        </TouchableOpacity>

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
  gallery: {
    flexDirection: 'row',
    height: 300,
    marginBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  mainImageContainer: {
    flex: 2,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
    position: 'relative',
  },
  mainImage: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageEmoji: {
    fontSize: 80,
  },
  badge: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: '#705C2E',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  thumbnailContainer: {
    flex: 1,
    gap: Spacing.lg,
  },
  thumbnail: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  thumbnailActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  thumbnailEmoji: {
    fontSize: 40,
  },
  moreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    height: '32%',
  },
  moreText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  detailsSection: {
    marginBottom: Spacing.xxxl,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    backgroundColor: Colors.highlight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  timeAgo: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.75,
    lineHeight: 37.5,
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  price: {
    fontSize: 30,
    fontWeight: '600',
    color: Colors.primary,
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.highlight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  conditionIcon: {
    fontSize: 10,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  descriptionSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 29,
  },
  sellerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxxl,
    ...Shadows.small,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.highlight,
    backgroundColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  sellerDetails: {
    gap: Spacing.xs,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingIcon: {
    fontSize: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  reviews: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  viewProfileButton: {
    borderWidth: 1,
    borderColor: 'rgba(172, 44, 19, 0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  totalPrice: {
    marginBottom: Spacing.xxl,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    position: 'relative',
    ...Shadows.primary,
  },
  buyButtonShadow: {
    position: 'absolute',
    inset: 0,
    borderRadius: BorderRadius.xxl,
    backgroundColor: 'transparent',
  },
  buyIcon: {
    fontSize: 20,
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  tradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.highlight,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  tradeIcon: {
    fontSize: 16,
  },
  tradeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  verificationList: {
    gap: Spacing.lg,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  verificationIcon: {
    fontSize: 12,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  reportIcon: {
    fontSize: 10,
  },
  reportText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  bottomSpacing: {
    height: 100,
  },
});
