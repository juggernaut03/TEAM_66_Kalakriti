import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

/**
 * QuickAction Component
 * A reusable button component with an icon, label, and customizable properties.
 *
 * @param {Object} props - Component props
 * @param {string} props.icon - Name of the icon (from MaterialCommunityIcons)
 * @param {string} props.label - Text to display on the button
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {string} [props.color] - Optional custom color
 * @param {boolean} [props.disabled] - Optional disabled state
 * @param {boolean} [props.loading] - Optional loading state
 * @param {string} [props.size] - Optional size variant ('small', 'medium', 'large')
 */
export const QuickAction = ({
  icon,
  label,
  onPress,
  color,
  disabled = false,
  loading = false,
  size = 'medium',
}) => {
  // Get theme colors from React Native Paper
  const theme = useTheme();

  // Define size variations
  const sizeStyles = {
    small: { padding: 8, fontSize: 12 },
    medium: { padding: 12, fontSize: 14 },
    large: { padding: 16, fontSize: 16 },
  };

  return (
    <Button
      mode="contained" // Filled button style
      icon={icon} // Icon name from MaterialCommunityIcons
      style={[
        styles.actionButton,
        { backgroundColor: color || theme.colors.primary },
        sizeStyles[size],
      ]}
      labelStyle={[
        styles.actionButtonLabel,
        { fontSize: sizeStyles[size].fontSize },
      ]}
      onPress={onPress} // Press handler
      disabled={disabled} // Disabled state
      loading={loading} // Loading state
      uppercase={false} // Don't force uppercase text
    >
      {label}
    </Button>
  );
};

// Styles
const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonLabel: {
    fontWeight: '600',
    marginLeft: 8,
  },
});

// Usage examples
const ExampleUsage = () => {
  // Example handlers
  const handleAddProduct = () => {
    console.log('Add Product pressed');
  };

  const handleViewOrders = () => {
    console.log('View Orders pressed');
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* Basic usage */}
      <QuickAction
        icon="plus"
        label="Add Product"
        onPress={handleAddProduct}
      />

      {/* With custom color */}
      <QuickAction
        icon="shopping"
        label="View Orders"
        onPress={handleViewOrders}
        color="#6200ee"
      />

      {/* Small size variant */}
      <QuickAction
        icon="chart-line"
        label="Analytics"
        onPress={() => {}}
        size="small"
      />

      {/* Large size with loading state */}
      <QuickAction
        icon="cash"
        label="Process Payment"
        onPress={() => {}}
        size="large"
        loading={true}
      />

      {/* Disabled state */}
      <QuickAction
        icon="lock"
        label="Restricted Action"
        onPress={() => {}}
        disabled={true}
      />
    </View>
  );
};

// Common icon examples that work with MaterialCommunityIcons
const COMMON_ICONS = {
  add: 'plus',
  edit: 'pencil',
  delete: 'trash-can',
  save: 'content-save',
  share: 'share-variant',
  download: 'download',
  upload: 'upload',
  search: 'magnify',
  settings: 'cog',
  menu: 'menu',
  close: 'close',
  back: 'arrow-left',
  forward: 'arrow-right',
  refresh: 'refresh',
  home: 'home',
  user: 'account',
  cart: 'cart',
  favorite: 'heart',
  notification: 'bell',
};

export default QuickAction;