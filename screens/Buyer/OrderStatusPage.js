import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

const OrderStatusPage = ({ route }) => {
  // Get the order object directly from route.params
  const { order } = route.params || {};

  // Log route.params for debugging
  console.log('Route Params:', route.params);

  // Handle undefined order
  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid order. Please try again.</Text>
      </View>
    );
  }

  // Example order timeline (can be dynamic based on order status)
  const orderTimeline = [
    { status: 'Placed', isCompleted: order.status === 'Placed' || order.status === 'Confirmed' || order.status === 'Shipped' || order.status === 'Delivered' },
    { status: 'Confirmed', isCompleted: order.status === 'Confirmed' || order.status === 'Shipped' || order.status === 'Delivered' },
    { status: 'Shipped', isCompleted: order.status === 'Shipped' || order.status === 'Delivered' },
    { status: 'Delivered', isCompleted: order.status === 'Delivered' },
  ];

  // Convert items to an array of objects (if it's a string)
  const orderItems = Array.isArray(order.items)
    ? order.items
    : [
        {
          name: 'Order Items',
          code: 'N/A',
          price: order.total,
          quantity: order.items, // Use the item count string directly
        },
      ];

  // Use the address from the order object
  const deliveryAddress = order.address || 'No address provided';

  return (
    <ScrollView style={styles.container}>
      {/* Order Number */}
      <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>

      {/* Order Status Timeline */}
      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        {orderTimeline.map((step, index) => (
          <View key={index} style={styles.timelineStep}>
            <View style={[styles.timelineIcon, step.isCompleted && styles.completedStep]}>
              {step.isCompleted ? (
                <Icon name="check" size={16} color={colors.background} />
              ) : (
                <Text style={styles.timelineText}>{index + 1}</Text>
              )}
            </View>
            <Text style={styles.timelineStatus}>{step.status}</Text>
          </View>
        ))}
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {orderItems.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCode}>Code: {item.code}</Text>
            <Text style={styles.itemPrice}>Price: {item.price}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.paymentDetailRow}>
          <Text style={styles.paymentLabel}>Payment Method</Text>
          <Text style={styles.paymentValue}>COD</Text>
        </View>
        <View style={styles.paymentDetailRow}>
          <Text style={styles.paymentLabel}>Items Total</Text>
          <Text style={styles.paymentValue}>{order.total}</Text>
        </View>
        <View style={styles.paymentDetailRow}>
          <Text style={styles.paymentLabel}>Delivery Charges</Text>
          <Text style={styles.paymentValue}>$0.00</Text>
        </View>
        <View style={styles.paymentDetailRow}>
          <Text style={styles.paymentLabel}>Total Amount</Text>
          <Text style={styles.paymentValue}>{order.total}</Text>
        </View>
      </View>

      {/* Delivery Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Details</Text>
        <Text style={styles.deliveryAddress}>{deliveryAddress}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  timelineContainer: {
    marginBottom: 24,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedStep: {
    backgroundColor: colors.primary,
  },
  timelineText: {
    fontSize: 14,
    color: colors.background,
  },
  timelineStatus: {
    fontSize: 14,
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemCode: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: colors.text,
  },
  paymentValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  deliveryAddress: {
    fontSize: 14,
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: colors.warning,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default OrderStatusPage;