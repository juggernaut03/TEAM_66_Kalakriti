import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OrderContext } from '../../navigation/OrderContext';
import { CartContext } from '../../navigation/index';
import api from '../../services/api';

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

const PaymentPage = ({ route, navigation }) => {
  const { cartItems, shippingAddress, grandTotal } = route.params;
  const { addOrder } = useContext(OrderContext);
  const { clearCart } = useContext(CartContext);

  const handlePayment = async (method) => {
    try {
      // Create order object for database
      const orderData = {
        orderNumber: `KK${Date.now()}`,
        status: 'pending', // Changed from 'Placed' to 'pending' to match enum
        products: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: grandTotal,
        shippingAddress: {
          street: `${shippingAddress.houseNo}, ${shippingAddress.street}`,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode
        },
        paymentMethod: method
      };

      console.log('Sending order data:', orderData); // Debug log

      const response = await api.post('/api/orders', orderData);

      if (response.data) {
        // Create order object for local state
        const localOrder = {
          id: response.data._id,
          orderNumber: response.data.orderNumber,
          status: 'pending', // Updated to match backend enum
          items: `${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`,
          total: `₹${grandTotal.toFixed(2)}`,
          date: new Date().toLocaleDateString(),
          address: `${shippingAddress.houseNo}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}`,
        };

        // Update local state
        addOrder(localOrder);
        
        // Clear the cart
        clearCart();

        // Navigate to confirmation
        navigation.navigate('Confirmation', { order: localOrder });
      }
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.',
        [{ text: 'OK' }]
      );
    }
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
        <Text style={styles.sectionTitle}>Your Order</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
          scrollEnabled={false}
        />
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.addressText}>{shippingAddress.houseNo}, {shippingAddress.street}</Text>
        <Text style={styles.addressText}>{shippingAddress.city}, {shippingAddress.state}</Text>
        <Text style={styles.addressText}>Postal Code: {shippingAddress.postalCode}</Text>
      </View>

      {/* Amount to Pay */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount to Pay</Text>
        <Text style={styles.grandTotal}>₹{grandTotal.toFixed(2)}</Text>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {/* Cash on Delivery */}
        <TouchableOpacity style={styles.paymentMethod} onPress={() => handlePayment('Cash on Delivery')}>
          <Icon name="local-shipping" size={24} color={colors.primary} />
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodTitle}>Cash on Delivery</Text>
            <Text style={styles.paymentMethodDescription}>Pay when you receive your order</Text>
          </View>
        </TouchableOpacity>

        {/* UPI Payment */}
        <TouchableOpacity style={styles.paymentMethod} onPress={() => handlePayment('UPI Payment')}>
          <Icon name="payment" size={24} color={colors.primary} />
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodTitle}>UPI Payment</Text>
            <Text style={styles.paymentMethodDescription}>Pay using any UPI app</Text>
          </View>
        </TouchableOpacity>

        {/* Card Payment */}
        <TouchableOpacity style={styles.paymentMethod} onPress={() => handlePayment('Card Payment')}>
          <Icon name="credit-card" size={24} color={colors.primary} />
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodTitle}>Card Payment</Text>
            <Text style={styles.paymentMethodDescription}>Credit or Debit card</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={() => handlePayment('Selected Method')}>
        <Text style={styles.payButtonText}>PAY ₹{grandTotal.toFixed(2)}</Text>
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
  addressText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  grandTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  paymentMethodDetails: {
    flex: 1,
    marginLeft: 16,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    marginTop: 16,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
  },
});

export default PaymentPage;