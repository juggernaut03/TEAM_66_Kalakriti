// NotificationScreen.js

import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';

// Sample data for notifications (this can be replaced with dynamic data)
const notifications = [
  { id: '1', title: 'New Order Received', description: 'You have a new order for your pottery item.' },
  { id: '2', title: 'Payment Successful', description: 'Your payment of $50 has been successfully processed.' },
  { id: '3', title: 'Order Shipped', description: 'Your order #12345 has been shipped.' },
];

const NotificationScreen = () => {
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Card.Content>
      <Divider />
      <Card.Actions>
        <Button mode="contained" onPress={() => alert(`View Details for ${item.id}`)}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4', // Background color for the screen
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 50,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3, // Shadow effect for cards
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 8,
  },
});

export default NotificationScreen;
