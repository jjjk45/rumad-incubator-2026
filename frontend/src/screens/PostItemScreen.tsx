import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';
import { TopAppBar, InputField, Button } from '../components';

interface PostItemScreenProps {
  onBack: () => void;
  onPublish: (itemData: {
    title: string;
    category: string;
    condition: string;
    price: string;
    isOpenToTrade: boolean;
    isNegotiable: boolean;
  }) => void;
}

const CATEGORIES = [
  'Electronics',
  'Books',
  'Furniture',
  'Home & Kitchen',
  'Clothing',
  'Sports',
  'Other',
];

const CONDITIONS = ['Like New', 'Good', 'Fair'];

export function PostItemScreen({ onBack, onPublish }: PostItemScreenProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [condition, setCondition] = useState('Like New');
  const [price, setPrice] = useState('');
  const [isOpenToTrade, setIsOpenToTrade] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handlePublish = () => {
    onPublish({
      title,
      category,
      condition,
      price,
      isOpenToTrade,
      isNegotiable,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TopAppBar onBackPress={onBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <View style={styles.stepHeader}>
          <View>
            <Text style={styles.stepLabel}>New Listing</Text>
            <Text style={styles.stepTitle}>List your gear</Text>
          </View>
          <View style={styles.stepDots}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <View style={styles.stepDot} />
            <View style={styles.stepDot} />
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📷</Text>
            <Text style={styles.sectionTitle}>Add Photos</Text>
          </View>

          <View style={styles.uploadGrid}>
            <View style={styles.mainUpload}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadLabel}>Cover Photo</Text>
              <View style={styles.uploadHint} />
            </View>

            <View style={styles.smallUploads}>
              <View style={styles.smallUpload}>
                <Text style={styles.smallUploadIcon}>+</Text>
              </View>
              <View style={styles.smallUpload}>
                <Text style={styles.smallUploadIcon}>+</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Item Title</Text>
            <View style={styles.customInput}>
              <Text
                style={styles.placeholder}
                numberOfLines={1}
              >
                {title || 'e.g. MacBook Pro 2021 M1'}
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            <TouchableOpacity
              style={styles.categorySelect}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text style={styles.categoryValue}>{category}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>

            {showCategoryPicker && (
              <View style={styles.categoryOptions}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      category === cat && styles.categoryOptionActive,
                    ]}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        category === cat && styles.categoryOptionTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Condition</Text>
            <View style={styles.conditionButtons}>
              {CONDITIONS.map((cond) => (
                <TouchableOpacity
                  key={cond}
                  style={[
                    styles.conditionButton,
                    condition === cond && styles.conditionButtonActive,
                  ]}
                  onPress={() => setCondition(cond)}
                >
                  <Text
                    style={[
                      styles.conditionButtonText,
                      condition === cond && styles.conditionButtonTextActive,
                    ]}
                  >
                    {cond}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <View style={styles.pricingHeader}>
            <Text style={styles.pricingTitle}>Price & Trade</Text>
            <Text style={styles.pricingIcon}>💰</Text>
          </View>

          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Asking Price</Text>
            <View style={styles.priceInputWrapper}>
              <View style={styles.priceInput}>
                <Text style={styles.currency}>$</Text>
                <Text
                  style={styles.pricePlaceholder}
                  numberOfLines={1}
                >
                  {price || '0.00'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.checkboxes}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsOpenToTrade(!isOpenToTrade)}
            >
              <View style={[styles.checkbox, isOpenToTrade && styles.checkboxChecked]} >
                {isOpenToTrade && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Open to Trade</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsNegotiable(!isNegotiable)}
            >
              <View style={[styles.checkbox, isNegotiable && styles.checkboxChecked]} >
                {isNegotiable && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Negotiable Price</Text>
            </TouchableOpacity>
          </View>

          {/* Growth Chip */}
          <View style={styles.growthChip}>
            <Text style={styles.growthIcon}>📈</Text>
            <Text style={styles.growthText}>
              Students who offer trades sell 40% faster on campus.
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handlePublish}
          activeOpacity={0.8}
        >
          <View style={styles.publishButtonShadow} />
          <Text style={styles.publishButtonText}>Publish Listing</Text>
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>By publishing, you agree to the{' '}</Text>
          <TouchableOpacity>
            <Text style={styles.termsLink}>community guidelines</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2A2C1A',
    letterSpacing: -0.75,
    lineHeight: 37.5,
  },
  stepDots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  stepDot: {
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gray200,
  },
  stepDotActive: {
    width: 32,
    backgroundColor: Colors.primary,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionIcon: {
    fontSize: 36,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2C1A',
  },
  uploadGrid: {
    gap: Spacing.lg,
  },
  mainUpload: {
    height: 200,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.borderDark,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  uploadIcon: {
    fontSize: 42,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A2C1A',
  },
  uploadHint: {
    height: 16,
  },
  smallUploads: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  smallUpload: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.borderDark,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallUploadIcon: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#48483A',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  customInput: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 60,
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(122, 122, 106, 0.6)',
  },
  categorySelect: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 60,
  },
  categoryValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2A2C1A',
  },
  chevron: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  categoryOptions: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  categoryOption: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  categoryOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  categoryOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  categoryOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  conditionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  conditionButton: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  conditionButtonActive: {
    backgroundColor: Colors.primary,
  },
  conditionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#48483A',
  },
  conditionButtonTextActive: {
    color: Colors.white,
  },
  pricingSection: {
    backgroundColor: '#F5F5DC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(210, 210, 187, 0.3)',
    padding: Spacing.xxl,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2C1A',
  },
  pricingIcon: {
    fontSize: 36,
  },
  priceInputContainer: {
    marginBottom: Spacing.xl,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#48483A',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  priceInputWrapper: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  currency: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  pricePlaceholder: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B7280',
  },
  checkboxes: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A2C1A',
  },
  growthChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(225, 191, 184, 0.2)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(225, 191, 184, 0.3)',
    padding: Spacing.lg,
  },
  growthIcon: {
    fontSize: 17,
  },
  growthText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#4A332E',
    lineHeight: 19.5,
  },
  bottomSpacing: {
    height: 150,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(251, 251, 226, 0.9)',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 48,
    ...Shadows.large,
  },
  publishButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
    marginBottom: Spacing.md,
    ...Shadows.primary,
  },
  publishButtonShadow: {
    position: 'absolute',
    inset: 0,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'transparent',
  },
  publishButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  termsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#48483A',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  termsLink: {
    fontSize: 12,
    color: Colors.primary,
    textDecorationLine: 'underline',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
