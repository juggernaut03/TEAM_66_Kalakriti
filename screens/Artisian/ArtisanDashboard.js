import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Surface, Text, Avatar, Card, FAB, Drawer } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ArtisianProfile from './ArtisianProfile';
import InventoryScreen from './InventoryScreen';
import ViewOrders from './ViewOrders';
import VoiceAssistant from './VoiceAssistant';
import GeminiVoiceAssistant from './GeminiVoiceAssistant';
const Tab = createBottomTabNavigator();

const colors = {
  primary: '#8C5E58',
  secondary: '#D4AA7D',
  accent: '#E3B448',
  text: '#2A2922',
  background: '#F5F2ED',
  muted: '#A49B8F',
  voiceAssistant: {
    primary: '#8C5E58',
    background: '#FFFFFF',
    text: '#2A2922',
    error: '#FF6B6B', 
    success: '#4CAF50',
  }
};

// Simplified Dashboard Component
const DashboardScreen = ({ navigation }) => {


  // Quick Categories for artisan resources
  const quickCategories = [
    { 
      icon: 'school', 
      label: 'Skill\nDevelopment',
      color: colors.primary,
      route: 'Skill', // Add route name
    },
    { 
      icon: 'bank', 
      label: 'Government\nSchemes',
      color: colors.secondary,
      route: 'GovnScn', // Add route name
    },
    { 
      icon: 'palette', 
      label: 'Design\nIdeas',
      color: colors.accent,
      route: 'DesignIdea', // Add route name
    },
    { 
      icon: 'chart-bar', 
      label: 'Gamification',
      color: colors.primary,
      route: 'Game', // Add route name
    },
    { 
      icon: 'calendar', 
      label: 'Events',
      color: colors.secondary,
      route: 'EventArtisan', // Add route name
    },
  ];

  // Main action buttons for artisans
  const mainActions = [
    { 
      icon: 'plus-circle', 
      label: 'Add New\nProduct', 
      route: 'AddProduct', 
      color: colors.primary,
      description: 'Upload your craft items'
    },
    { 
      icon: 'shopping', 
      label: 'View\nOrders', 
      route: 'ViewOrders', 
      color: colors.secondary,
      description: 'Check customer orders'
    },
    { 
      icon: 'currency-inr', 
      label: 'My\nEarnings', 
      route: 'Earnings', 
      color: colors.accent,
      description: 'See your income'
    },
    { 
      icon: 'package-variant', 
      label: 'My\nProducts', 
      route: 'Inventory', 
      color: colors.primary,
      description: 'Manage your items'
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Menu and Wallet */}
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name="menu" size={28} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Avatar.Image 
                size={48} 
                source={{ uri: 'https://via.placeholder.com/48' }} 
              />
              <View style={styles.headerText}>
                <Text style={styles.welcomeText}>नमस्ते / Welcome,</Text>
                <Text style={styles.nameText}>Rajesh Kumar</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
              <Icon name="wallet" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Surface>

      <ScrollView style={styles.content}>
        {/* Today's Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>₹4,250</Text>
              <Text style={styles.summaryLabel}>Today's Sales</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>New Orders</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Categories Section */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickCategories}
        >
          {quickCategories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.categoryItem}
              onPress={() => navigation.navigate(category.route)} // Add navigation
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Icon name={category.icon} size={24} color="#FFF" />
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Main Action Buttons */}
        <Text style={styles.sectionTitle}>Main Actions</Text>
        <View style={styles.actionsGrid}>
          {mainActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={32} color="#FFF" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Help Card */}
        <Card style={styles.helpCard}>
          <Card.Content>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <TouchableOpacity style={styles.helpButton}>
              <Icon name="phone" size={24} color={colors.primary} />
              <Text style={[styles.helpButtonText, { color: colors.primary }]}>
                Call Support
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating AI Assistant */}
      <GeminiVoiceAssistant
        
        navigation={navigation} 
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.muted,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 16,
  },
  quickCategories: {
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.muted,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.muted,
  },
  helpCard: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  helpButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
 
});

// Navigator Component
const ArtisanDashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = 'home'; break;
            case 'Orders': iconName = 'shopping'; break;
            case 'Products': iconName = 'package-variant'; break;
            case 'Profile': iconName = 'account'; break;
            default: iconName = 'circle';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Orders" component={ViewOrders} />
      <Tab.Screen name="Products" component={InventoryScreen} />
      <Tab.Screen name="Profile" component={ArtisianProfile} />
    </Tab.Navigator>
  );
};

export default ArtisanDashboard;