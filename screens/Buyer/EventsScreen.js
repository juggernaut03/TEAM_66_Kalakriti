// EventsScreen.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Sample data for events
const upcomingEventsData = [
  {
    id: '1',
    title: 'Art Exhibition',
    description: 'Explore the latest art from local artists.',
    date: '2025-02-15',
    fees: 'Free',
    venue: 'Art Gallery, City Center',
    organizer: 'Art Society',
  },
  {
    id: '2',
    title: 'Craft Fair',
    description: 'Join us for a day of crafts and creativity.',
    date: '2025-03-10',
    fees: '₹100',
    venue: 'Community Hall, Downtown',
    organizer: 'Craft Lovers',
  },
];

const enrolledEventsData = [
  {
    id: '3',
    title: 'Photography Workshop',
    description: 'Learn photography skills with experts.',
    date: '2025-01-20',
    fees: '₹500',
    venue: 'Photography Studio, Main St.',
    organizer: 'Photo Academy',
  },
];

// Event Card Component
const EventCard = ({ event }) => {
  const navigation = useNavigation(); // Get navigation object

  const handleRegister = () => {
    navigation.navigate('EventReg', { eventName: event.title }); // Navigate to EventRegisterScreen
  };

  return (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
      <Text style={styles.eventDetails}>Date: {event.date}</Text>
      <Text style={styles.eventDetails}>Fees: {event.fees}</Text>
      <Text style={styles.eventDetails}>Venue: {event.venue}</Text>
      <Text style={styles.eventDetails}>Organizer: {event.organizer}</Text>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

// Upcoming Events Screen
const UpcomingEventsScreen = () => (
  <FlatList
    data={upcomingEventsData}
    renderItem={({ item }) => <EventCard event={item} />}
    keyExtractor={(item) => item.id}
  />
);

// Enrolled Events Screen
const EnrolledEventsScreen = () => (
  <FlatList
    data={enrolledEventsData}
    renderItem={({ item }) => <EventCard event={item} />}
    keyExtractor={(item) => item.id}
  />
);

// Main Events Screen with Tabs
const EventsScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Upcoming" 
        component={UpcomingEventsScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="event" size={24} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Enrolled" 
        component={EnrolledEventsScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="check-circle" size={24} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 14,
    marginVertical: 8,
  },
  eventDetails: {
    fontSize: 12,
    color: '#555',
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: '#8C5E58',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

// Export the main component
export default EventsScreen;
