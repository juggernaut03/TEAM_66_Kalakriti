// src/utils/theme.js

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color palette
export const colors = {
  // Primary colors
  primary: '#8C5E58',      // Earthy brown - main brand color
  secondary: '#D4AA7D',    // Warm sand - secondary brand color
  accent: '#E3B448',       // Golden yellow - accent color
  
  // Text colors
  text: {
    primary: '#2A2922',    // Dark gray for primary text
    secondary: '#666666',  // Medium gray for secondary text
    muted: '#A49B8F',     // Light gray for disabled/muted text
    inverse: '#FFFFFF',    // White text for dark backgrounds
  },
  
  // Background colors
  background: {
    primary: '#F5F2ED',   // Light beige - main background
    secondary: '#FFFFFF', // White - card/surface background
    accent: '#FFF9F0',    // Warm white - subtle accent background
  },
  
  // Status colors
  status: {
    success: '#4CAF50',   // Green for success states
    warning: '#FFA000',   // Amber for warnings
    error: '#FF6B6B',     // Red for errors
    info: '#2196F3',      // Blue for information
  },
  
  // Border colors
  border: {
    light: '#E0E0E0',     // Light gray for subtle borders
    medium: '#BDBDBD',    // Medium gray for visible borders
    dark: '#8C5E58',      // Dark border matching primary color
  },

  // Specific feature colors
  voiceAssistant: {
    primary: '#8C5E58',
    background: '#FFFFFF',
    listening: '#4CAF50',
    processing: '#FFA000',
  }
};

// Typography
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

// Shadows
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
};

// Layout
export const layout = {
  windowWidth: width,
  windowHeight: height,
  maxWidth: 500,             // Maximum content width
  headerHeight: 60,
  bottomTabHeight: 60,
  defaultPadding: 16,
};

// Common styles
export const commonStyles = {
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.light,
  },
  
  header: {
    backgroundColor: colors.background.secondary,
    height: layout.headerHeight,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    ...shadows.light,
  },
  
  button: {
    primary: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
    },
    outline: {
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      padding: spacing.md,
    },
  },
  
  text: {
    header: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      color: colors.text.primary,
    },
    title: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
      color: colors.text.primary,
    },
    body: {
      fontSize: typography.sizes.md,
      color: colors.text.primary,
    },
    caption: {
      fontSize: typography.sizes.sm,
      color: colors.text.secondary,
    },
  },
};

// Helper functions
export const getScaledSize = (size) => {
  const baseWidth = 375; // Base width (iPhone X)
  return (width / baseWidth) * size;
};

// Responsive font sizes
export const getFontSize = (size) => {
  return getScaledSize(typography.sizes[size] || size);
};

// Theme object combining all aspects
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  commonStyles,
  getScaledSize,
  getFontSize,
};

export default theme;