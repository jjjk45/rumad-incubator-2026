import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  type TouchableOpacityProps,
} from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  style,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  // Variants
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },
  secondary: {
    backgroundColor: Colors.highlight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  medium: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  large: {
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.textOnPrimary,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.textSecondary,
  },
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
});
