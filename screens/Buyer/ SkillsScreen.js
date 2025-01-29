// SkillsScreen.js
import React, { useState } from 'react';
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

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Sample data for skills
const availableSkillsData = [
  {
    id: '1',
    title: 'Photography',
    description: 'Learn the art of capturing moments.',
    fees: '₹1000',
    duration: '4 weeks',
    instructor: 'John Doe',
  },
  {
    id: '2',
    title: 'Painting',
    description: 'Discover your creativity with colors.',
    fees: '₹1500',
    duration: '6 weeks',
    instructor: 'Jane Smith',
  },
];

const enrolledSkillsData = [
  {
    id: '3',
    title: 'Digital Marketing',
    description: 'Master the skills of online marketing.',
    fees: '₹2000',
    duration: '8 weeks',
    instructor: 'Alice Johnson',
  },
];

// Skill Card Component
const SkillCard = ({ skill }) => (
  <View style={styles.skillCard}>
    <Text style={styles.skillTitle}>{skill.title}</Text>
    <Text style={styles.skillDescription}>{skill.description}</Text>
    <Text style={styles.skillDetails}>Fees: {skill.fees}</Text>
    <Text style={styles.skillDetails}>Duration: {skill.duration}</Text>
    <Text style={styles.skillDetails}>Instructor: {skill.instructor}</Text>
    <TouchableOpacity style={styles.enrollButton}>
      <Text style={styles.enrollButtonText}>Enroll</Text>
    </TouchableOpacity>
  </View>
);

// Available Skills Screen
const AvailableSkillsScreen = () => (
  <FlatList
    data={availableSkillsData}
    renderItem={({ item }) => <SkillCard skill={item} />}
    keyExtractor={(item) => item.id}
  />
);

// Enrolled Skills Screen
const EnrolledSkillsScreen = () => (
  <FlatList
    data={enrolledSkillsData}
    renderItem={({ item }) => <SkillCard skill={item} />}
    keyExtractor={(item) => item.id}
  />
);

// Main Skills Screen with Tabs
const SkillsScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Available" 
        component={AvailableSkillsScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="school" size={24} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Enrolled" 
        component={EnrolledSkillsScreen} 
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
  skillCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skillDescription: {
    fontSize: 14,
    marginVertical: 8,
  },
  skillDetails: {
    fontSize: 12,
    color: '#555',
  },
  enrollButton: {
    marginTop: 10,
    backgroundColor: '#8C5E58',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

// Export the main component
export default SkillsScreen;
