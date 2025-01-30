import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { OrderContext } from '../../navigation/OrderContext'; // Adjust the path as needed
import { LineChart } from 'react-native-chart-kit';
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

const EarningsPage = () => {
  const { orders } = useContext(OrderContext); // Get orders from context

  // Filter delivered orders
  const deliveredOrders = orders.filter((order) => order.status === 'Delivered');

  // Calculate total earnings
  const totalEarnings = deliveredOrders.reduce((total, order) => {
    const amount = parseFloat(order.total.replace(/[^0-9.]/g, ''));
    return total + amount;
  }, 0);

  // Calculate average earnings per order
  const averageEarnings = deliveredOrders.length > 0 ? totalEarnings / deliveredOrders.length : 0;

  // Mock data for earnings over time (e.g., last 7 days)
  const earningsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [500, 800, 1200, 900, 1500, 1000, 1700], // Replace with actual data
        color: (opacity = 1) => `rgba(140, 94, 88, ${opacity})`, // Primary color
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Earnings Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Earnings</Text>
        <Text style={styles.summaryAmount}>¥{totalEarnings.toFixed(2)}</Text>
        <Text style={styles.summarySubtitle}>From {deliveredOrders.length} Delivered Orders</Text>
      </View>

      {/* Earnings Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Earnings Over Time</Text>
        <LineChart
          data={earningsData}
          width={Dimensions.get('window').width - 32}
          height={220}
          yAxisLabel="¥"
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(140, 94, 88, ${opacity})`, // Primary color
            labelColor: (opacity = 1) => `rgba(42, 41, 34, ${opacity})`, // Text color
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: colors.primary,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Order Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Order Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="shopping-cart" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="check-circle" size={24} color={colors.success} />
            <Text style={styles.statValue}>{deliveredOrders.length}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="pending" size={24} color={colors.warning} />
            <Text style={styles.statValue}>
              {orders.length - deliveredOrders.length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Average Earnings */}
      <View style={styles.averageContainer}>
        <Text style={styles.sectionTitle}>Average Earnings</Text>
        <Text style={styles.averageAmount}>¥{averageEarnings.toFixed(2)} per order</Text>
      </View>

      {/* Delivered Orders List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivered Orders</Text>
        {deliveredOrders.map((order, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
            <Text style={styles.orderTotal}>Amount: {order.total}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
        ))}
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
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  averageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  averageAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderTotal: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
});

export default EarningsPage;