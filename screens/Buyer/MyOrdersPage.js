import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView 
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
};

const MyOrdersPage = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Active');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      
      // Transform the orders data
      const formattedOrders = response.data.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        items: `${order.products.length} item${order.products.length !== 1 ? 's' : ''}`,
        total: formatCurrency(order.totalAmount),
        date: `Ordered on ${new Date(order.createdAt).toLocaleDateString()}`,
        products: order.products,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#FFA000';
      case 'processing': return '#2196F3';
      case 'shipped': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return colors.muted;
    }
  };

  const handleCancelOrder = async (orderId) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await api.put(`/api/orders/${orderId}`, { status: 'cancelled' });
              const updatedOrders = orders.map((order) =>
                order.id === orderId ? { ...order, status: 'cancelled' } : order
              );
              setOrders(updatedOrders);
              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel order. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'Active') {
      return order.status === 'pending' || order.status === 'processing' || order.status === 'shipped';
    } else if (activeTab === 'Completed') {
      return order.status === 'delivered';
    } else if (activeTab === 'Cancelled') {
      return order.status === 'cancelled';
    }
    return true;
  });

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Order Products */}
      <View style={styles.productsContainer}>
        {item.products && item.products.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {product.product.name}
              </Text>
              <Text style={styles.productQuantity}>
                Qty: {product.quantity} × {formatCurrency(product.price)}
              </Text>
            </View>
            <Text style={styles.productTotal}>
              {formatCurrency(product.quantity * product.price)}
            </Text>
          </View>
        ))}
      </View>

      {/* Shipping Address */}
      {item.shippingAddress && (
        <View style={styles.shippingContainer}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.addressText}>
            {item.shippingAddress.street}
          </Text>
          <Text style={styles.addressText}>
            {item.shippingAddress.city}, {item.shippingAddress.state}
          </Text>
          <Text style={styles.addressText}>
            {item.shippingAddress.postalCode}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      {/* Payment Information */}
      <View style={styles.paymentContainer}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <Text style={styles.paymentMethod}>
          Method: {item.paymentMethod || 'Not specified'}
        </Text>
      </View>

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items Total</Text>
          <Text style={styles.summaryValue}>{formatCurrency(item.totalAmount)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>₹100.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(item.totalAmount + 100)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => navigation.navigate('OrderStatusPage', { order: item })}
        >
          <Icon name="receipt-long" size={18} color={colors.primary} />
          <Text style={styles.viewDetailsText}>Track Order</Text>
        </TouchableOpacity>

        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelOrder(item.id)}
          >
            <Icon name="cancel" size={18} color={colors.warning} />
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Active' && styles.activeTab]}
          onPress={() => setActiveTab('Active')}
        >
          <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('Cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'Cancelled' && styles.activeTabText]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchOrders}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color={colors.muted} />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 4,
    elevation: 2,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.background,
    fontWeight: '600',
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  productsContainer: {
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  productQuantity: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  productTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  shippingContainer: {
    marginBottom: 12,
  },
  paymentContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  paymentMethod: {
    fontSize: 13,
    color: colors.muted,
  },
  addressText: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  summaryContainer: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 13,
    color: colors.text,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  viewDetailsText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  cancelButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.warning,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted,
    marginTop: 8,
  },
});

export default MyOrdersPage;