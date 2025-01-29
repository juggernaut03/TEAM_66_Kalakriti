import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, IconButton, Divider } from 'react-native-paper';

/**
 * DashboardCard Component
 * A reusable card component with a title, optional icon, and customizable content.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {Function} [props.onPress] - Optional press handler
 * @param {string} [props.icon] - Optional icon name
 * @param {Object} [props.style] - Optional additional styles
 */
export const DashboardCard = ({ title, children, onPress, icon, style }) => {
  // Use TouchableOpacity if onPress is provided, otherwise use View
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} style={styles.wrapper}>
      <Card style={[styles.card, style]} elevation={2}>
        <Card.Content>
          {/* Header section with title and optional icon */}
          <View style={styles.header}>
            <Title style={styles.cardTitle}>{title}</Title>
            {icon && (
              <IconButton icon={icon} size={20} color="#333" style={styles.iconButton} />
            )}
          </View>

          {/* Divider line */}
          <Divider style={styles.divider} />

          {/* Card content passed as children */}
          <View style={styles.content}>{children}</View>
        </Card.Content>
      </Card>
    </Wrapper>
  );
};

// Styles
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16, // Add margin to the wrapper for consistent spacing
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // Add padding for better spacing
    paddingTop: 12, // Add top padding
  },
  cardTitle: {
    fontSize: 18,
    color: '#333',
    flex: 1, // Allow title to take remaining space
  },
  iconButton: {
    padding: 0, // Remove default padding for better alignment
  },
  content: {
    paddingHorizontal: 16, // Add padding for better content readability
    paddingBottom: 12, // Add bottom padding
  },
  divider: {
    backgroundColor: '#ddd',
    marginHorizontal: 16, // Match horizontal padding of content
    marginTop: 12, // Add margin for spacing
    marginBottom: 12,
  },
});

// Usage examples (unchanged)
// ...

export default DashboardCard;