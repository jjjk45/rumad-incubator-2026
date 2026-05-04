import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LandingScreenProps {
  onGetStarted: () => void;
}

export function LandingScreen({ onGetStarted }: LandingScreenProps) {
  return (
    <View style={styles.container}>
      {/* Soft blur light background */}
      <View style={styles.blurLight} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Avatar Stack */}
        <View style={styles.avatarStack}>
          <View style={[styles.avatar, styles.avatarOverlap]}>
            <Text style={styles.avatarEmoji}>👨‍🎓</Text>
          </View>
          <View style={[styles.avatar, styles.avatarOverlap]}>
            <Text style={styles.avatarEmoji}>👩‍🎓</Text>
          </View>
          <View style={[styles.avatar, styles.avatarOverlap]}>
            <Text style={styles.avatarEmoji}>🧑‍🎓</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>999+ Verified Students</Text>
            <Text style={styles.statsText}>101 Items Listed for Sale</Text>
          </View>
        </View>

        {/* Headline */}
        <View style={styles.headlineContainer}>
          <Text style={styles.headline}>Join The</Text>
          <Text style={[styles.headline, styles.headlineAccent]}>Rutgers</Text>
          <Text style={styles.headline}>Thrift</Text>
        </View>

        {/* Image Collage */}
        <View style={styles.collageContainer}>
          {/* Used Desk - Top Left */}
          <View style={[styles.collageItem, styles.deskImage]}>
            <Text style={styles.collageEmoji}>🪑</Text>
          </View>

          {/* Used Brushes - Top Right */}
          <View style={[styles.collageItem, styles.brushesImage]}>
            <Text style={styles.collageEmoji}>🖌️</Text>
          </View>

          {/* Used Pens - Middle Left */}
          <View style={[styles.collageItem, styles.pensImage]}>
            <Text style={styles.collageEmoji}>✏️</Text>
          </View>

          {/* Used Lamp - Bottom Right */}
          <View style={[styles.collageItem, styles.lampImage]}>
            <Text style={styles.collageEmoji}>💡</Text>
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started!</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  blurLight: {
    position: 'absolute',
    top: -48,
    left: -48,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(255, 218, 211, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
    minHeight: SCREEN_HEIGHT - 100,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 4,
    borderColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  statsContainer: {
    marginLeft: Spacing.sm,
  },
  statsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  headlineContainer: {
    marginBottom: Spacing.xxxl,
  },
  headline: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -2.4,
    lineHeight: 52,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  headlineAccent: {
    color: Colors.primary,
  },
  collageContainer: {
    height: 400,
    position: 'relative',
  },
  collageItem: {
    borderRadius: 15,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
    overflow: 'hidden',
  },
  collageEmoji: {
    fontSize: 40,
  },
  deskImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 150,
    height: 172,
  },
  brushesImage: {
    position: 'absolute',
    right: 0,
    top: 20,
    width: 112,
    height: 172,
  },
  pensImage: {
    position: 'absolute',
    left: 80,
    top: 100,
    width: 120,
    height: 120,
  },
  lampImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 180,
    height: 180,
  },
  spacer: {
    flex: 1,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 112,
    paddingVertical: Spacing.lg,
    marginTop: 10,
    alignItems: 'center',
    ...Shadows.medium,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    lineHeight: 24,
  },
});
