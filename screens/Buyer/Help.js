import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define the color schema
const colors = {
  primary: '#8C5E58', // Earthy terracotta
  secondary: '#D4AA7D', // Warm sand
  accent: '#E3B448', // Golden yellow
  text: '#2A2922', // Deep charcoal
  background: '#F5F2ED', // Off-white
  muted: '#A49B8F', // Neutral taupe
};

const Help = ({ navigation }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.text }]}>Help Center</Text>
      </View>

      {/* Help Options */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('FAQ')}
      >
        <Icon name="help-outline" size={24} color={colors.primary} />
        <Text style={[styles.menuText, { color: colors.text }]}>FAQs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('ContactSupport')}
      >
        <Icon name="headset-mic" size={24} color={colors.primary} />
        <Text style={[styles.menuText, { color: colors.text }]}>Contact Support</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('OrderHelp')}
      >
        <Icon name="shopping-cart" size={24} color={colors.primary} />
        <Text style={[styles.menuText, { color: colors.text }]}>Order Help</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('AccountHelp')}
      >
        <Icon name="person" size={24} color={colors.primary} />
        <Text style={[styles.menuText, { color: colors.text }]}>Account Help</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('PaymentHelp')}
      >
        <Icon name="credit-card" size={24} color={colors.primary} />
        <Text style={[styles.menuText, { color: colors.text }]}>Payment Help</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.muted }]}>
          Need more help? Reach out to us!
        </Text>
        <TouchableOpacity
          style={[styles.checkSavingsButton, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.checkSavingsText, { color: colors.background }]}>
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    marginLeft: 16,
    fontSize: 18,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  checkSavingsButton: {
    marginTop: 8,
    padding: 8,
    borderRadius: 4,
  },
  checkSavingsText: {
    fontSize: 16,
  },
});

export default Help;