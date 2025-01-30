import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  ActivityIndicator,
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
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
  error: '#F44336',
};

const OrderDetailsPage = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/status`, {
        status: newStatus
      });

      if (response.data) {
        setOrder(response.data);
        Alert.alert('Success', `Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return colors.warning;
      case 'processing': return colors.accent;
      case 'shipped': return colors.primary;
      case 'delivered': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.muted;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Order Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>
          {new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      {/* Products Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products</Text>
        {order.products.map((item, index) => (
          <View key={index} style={styles.productCard}>
            {item.product.images && item.product.images[0] && (
              <Image 
                source={{ uri: item.product.images[0] }} 
                style={styles.productImage}
              />
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.productPrice}>
                {formatCurrency(item.price)} × {item.quantity}
              </Text>
            </View>
            <Text style={styles.productTotal}>
              {formatCurrency(item.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.addressCard}>
          <Icon name="location-on" size={24} color={colors.primary} />
          <View style={styles.addressInfo}>
            <Text style={styles.addressText}>{order.shippingAddress.street}</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </Text>
            <Text style={styles.addressText}>{order.shippingAddress.postalCode}</Text>
          </View>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <Text style={styles.paymentValue}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Subtotal</Text>
            <Text style={styles.paymentValue}>{formatCurrency(order.totalAmount)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Shipping</Text>
            <Text style={styles.paymentValue}>{formatCurrency(100)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(order.totalAmount + 100)}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      {user?.role === 'artisan' && order.status !== 'cancelled' && order.status !== 'delivered' && (
        <View style={styles.buttonContainer}>
          {order.status === 'pending' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.accent }]}
              onPress={() => handleUpdateStatus('processing')}
            >
              <Icon name="hourglass-empty" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Start Processing</Text>
            </TouchableOpacity>
          )}
          
          {order.status === 'processing' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => handleUpdateStatus('shipped')}
            >
              <Icon name="local-shipping" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Mark as Shipped</Text>
            </TouchableOpacity>
          )}

          {order.status === 'shipped' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.success }]}
              onPress={() => handleUpdateStatus('delivered')}
            >
              <Icon name="check-circle" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Mark as Delivered</Text>
            </TouchableOpacity>
          )}

          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.error }]}
              onPress={() => handleUpdateStatus('cancelled')}
            >
              <Icon name="cancel" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  statusCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    color: colors.muted,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#FFF',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  productQuantity: {
    color: colors.muted,
    marginTop: 4,
  },
  productPrice: {
    color: colors.primary,
    marginTop: 4,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
  },
  addressInfo: {
    marginLeft: 12,
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  paymentCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    color: colors.muted,
  },
  paymentValue: {
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.muted,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  }
});

export default OrderDetailsPage;