import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image } from 'react-native';
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

const validStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CheckoutPage = ({ route, navigation }) => {
  const { cartItems = [] } = route.params;

  const subtotal = (cartItems || []).reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = 100;
  const grandTotal = subtotal + tax + shipping;

  const [shippingAddress, setShippingAddress] = useState({
    houseNo: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const handleProceedToPayment = () => {
    const { houseNo, street, city, state, postalCode } = shippingAddress;

    // Validate shipping address
    if (!houseNo || !street || !city || !state || !postalCode) {
      alert('Please fill in all shipping address fields.');
      return;
    }

    // Validate state
    if (!validStates.includes(state)) {
      alert('Please enter a valid Indian state.');
      return;
    }

    // Validate postal code (PIN code)
    const pinCodeRegex = /^[1-9][0-9]{5}$/; // Validates a six-digit PIN code
    if (!pinCodeRegex.test(postalCode)) {
      alert('Please enter a valid PIN code (6 digits).');
      return;
    }

    navigation.navigate('Payment', { cartItems, shippingAddress, grandTotal });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemArtisan}>By {item.artisan}</Text>
        <Text style={styles.cartItemPrice}>₹{item.price}</Text>
        <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Display Cart Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Cart</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
          scrollEnabled={false}
        />
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (10%)</Text>
          <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>₹{shipping.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.totalLabel]}>Grand Total</Text>
          <Text style={styles.grandTotal}>₹{grandTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <TextInput
          style={styles.input}
          placeholder="House No."
          value={shippingAddress.houseNo}
          onChangeText={(text) => setShippingAddress({ ...shippingAddress, houseNo: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Street"
          value={shippingAddress.street}
          onChangeText={(text) => setShippingAddress({ ...shippingAddress, street: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={shippingAddress.city}
          onChangeText={(text) => setShippingAddress({ ...shippingAddress, city: text })}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="State"
            value={shippingAddress.state}
            onChangeText={(text) => setShippingAddress({ ...shippingAddress, state: text })}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Postal Code"
            value={shippingAddress.postalCode}
            onChangeText={(text) => setShippingAddress({ ...shippingAddress, postalCode: text })}
            keyboardType="numeric" // Ensures only numeric input for PIN code
          />
        </View>
      </View>

      {/* Proceed to Payment Button */}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleProceedToPayment}>
        <Icon name="lock" size={20} color={colors.background} style={styles.checkoutIcon} />
        <Text style={styles.checkoutText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cartItemArtisan: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  cartItemQuantity: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.muted,
    marginVertical: 12,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    marginLeft: 8,
  },
  checkoutIcon: {
    marginRight: 8,
  },
});

export default CheckoutPage;