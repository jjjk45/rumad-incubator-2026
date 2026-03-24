/**
 * Design System Colors for RU Thrift App
 * Based on Figma design tokens
 */

export const Colors = {
  // Primary Brand Colors
  primary: '#AC2C13',
  primaryLight: '#FCEAE6',
  primaryDark: '#8A230F',

  // Background Colors
  background: '#FBFBE2',
  backgroundLight: '#F6F6DC',
  backgroundDark: '#EFEFD7',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5DC',

  // Text Colors
  textPrimary: '#1B1D0E',
  textSecondary: '#53433F',
  textMuted: '#857370',
  textOnPrimary: '#FFFFFF',

  // Accent Colors
  highlight: '#FFDAC8',
  highlightLight: '#FFEBE5',
  border: '#D8C2BE',
  borderLight: 'rgba(216, 194, 190, 0.3)',
  borderDark: '#D2D2BB',

  // Status Colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',

  // Neutral
  white: '#FFFFFF',
  black: '#1C1B12',
  gray100: '#F5F5F5',
  gray200: '#E5E5CE',
  gray300: '#DBDCC3',
  gray400: '#B3B3B3',

  // Tab Bar
  tabBarBackground: 'rgba(251, 251, 226, 0.8)',
  tabBarBorder: 'rgba(216, 194, 190, 0.15)',
  tabInactive: '#775651',
  tabActive: '#FFFFFF',
} as const;

export const Fonts = {
  plusJakarta: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    semiBold: 'PlusJakartaSans-SemiBold',
    bold: 'PlusJakartaSans-Bold',
    extraBold: 'PlusJakartaSans-ExtraBold',
  },
  inter: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
} as const;

export const Shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  primary: {
    shadowColor: '#AC2C13',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
  },
  bottomNav: {
    shadowColor: '#1B1D0E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;
