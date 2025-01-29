import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import QuickAction from './QuickAction'; // Ensure this import is correct

const QuickActionList = ({ actions }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      <View style={styles.buttonRow}>
        {actions.map((action, index) => (
          <QuickAction
            key={index}
            icon={action.icon}
            label={action.label}
            onPress={action.onPress}
            color={action.color}
            disabled={action.disabled}
            loading={action.loading}
            size={action.size}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
});

// Export as default
export default QuickActionList;