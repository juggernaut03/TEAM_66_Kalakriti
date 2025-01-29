import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { OrderContext } from '../../navigation/OrderContext'; // Adjust the path as needed
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

const WalletPage = () => {
  const { orders } = useContext(OrderContext); // Get orders from context

  // Mock wallet data
  const walletData = {
    balance: 2500.0, // Current balance
    totalEarnings: 5000.0, // Total earnings
    totalWithdrawals: 2500.0, // Total withdrawals
    transactions: [
      { id: '1', type: 'earning', amount: 750.0, date: '2023-10-01', description: 'Order #1737659915561' },
      { id: '2', type: 'withdrawal', amount: -500.0, date: '2023-10-05', description: 'Withdrawal to Bank' },
      { id: '3', type: 'earning', amount: 1200.0, date: '2023-10-10', description: 'Order #1737659915562' },
      { id: '4', type: 'withdrawal', amount: -1000.0, date: '2023-10-15', description: 'Withdrawal to Bank' },
      { id: '5', type: 'earning', amount: 900.0, date: '2023-10-20', description: 'Order #1737659915563' },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Available Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Available Balance</Text>
        <Text style={styles.balanceAmount}>¥{walletData.balance.toFixed(2)}</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Earnings and Withdrawals Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Icon name="trending-up" size={24} color={colors.success} />
          <Text style={styles.summaryValue}>¥{walletData.totalEarnings.toFixed(2)}</Text>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
        </View>
        <View style={styles.summaryCard}>
          <Icon name="trending-down" size={24} color={colors.warning} />
          <Text style={styles.summaryValue}>¥{walletData.totalWithdrawals.toFixed(2)}</Text>
          <Text style={styles.summaryLabel}>Total Withdrawals</Text>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {walletData.transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Icon
                name={transaction.type === 'earning' ? 'arrow-downward' : 'arrow-upward'}
                size={20}
                color={transaction.type === 'earning' ? colors.success : colors.warning}
              />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: transaction.type === 'earning' ? colors.success : colors.warning },
              ]}
            >
              {transaction.type === 'earning' ? '+' : '-'}¥{Math.abs(transaction.amount).toFixed(2)}
            </Text>
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
  balanceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: 8,
  },
  withdrawButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    elevation: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
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
  transactionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  transactionIcon: {
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default WalletPage;