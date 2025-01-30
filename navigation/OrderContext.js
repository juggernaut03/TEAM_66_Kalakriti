import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial orders data
const initialOrders = [
  {
    id: '1',
    orderNumber: '#1737659915561',
    status: 'Placed',
    items: '1 item',
    total: '¥750.00',
    date: 'Ordered on 24/1/2025',
    address: '123 Main St, City, Country',
  },
  {
    id: '2',
    orderNumber: '#1737659915562',
    status: 'Delivered',
    items: '2 items',
    total: '¥1200.00',
    date: 'Ordered on 23/1/2025',
    address: '456 Elm St, City, Country',
  },
  {
    id: '3',
    orderNumber: '#1737659915563',
    status: 'Cancelled',
    items: '3 items',
    total: '¥1500.00',
    date: 'Ordered on 22/1/2025',
    address: '789 Oak St, City, Country',
  },
];

// Create the context
export const OrderContext = createContext();

// Create the provider
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders from AsyncStorage when the app starts
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
          setOrders(initialOrders);
          await AsyncStorage.setItem('orders', JSON.stringify(initialOrders));
        }
      } catch (error) {
        console.error('Failed to load orders from AsyncStorage:', error);
      }
    };

    loadOrders();
  }, []);

  // Save orders to AsyncStorage whenever they change
  useEffect(() => {
    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Failed to save orders to AsyncStorage:', error);
      }
    };

    saveOrders();
  }, [orders]);

  // Function to add a new order
  const addOrder = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  // Function to update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{ orders, setOrders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};