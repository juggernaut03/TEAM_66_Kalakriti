import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const colors = {
  primary: '#8C5E58',
  secondary: '#D4AA7D',
  accent: '#E3B448',
  text: '#2A2922',
  background: '#F5F2ED',
  muted: '#A49B8F',
  success: '#4CAF50',
  warning: '#FFA000',
};

const ConfirmationPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={80} color={colors.success} />
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.message}>Your order has been placed successfully.</Text>

      {/* View My Orders Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MyOrders')} // Navigate to My Orders page
      >
        <Text style={styles.buttonText}>View My Orders</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  message: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});

export default ConfirmationPage;