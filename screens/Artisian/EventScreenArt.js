import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EventScreenArt = () => {
  const navigation = useNavigation();
  
  const categories = [
    { id: 1, name: 'Workshops', icon: 'calendar-outline', type: 'workshop' },
    { id: 2, name: 'Exhibitions', icon: 'heart-outline', type: 'exhibition' },
    { id: 3, name: 'Training', icon: 'school-outline', type: 'training' },
  ];

  // Updated events data structure to match MongoDB schema
  const events = [
    {
      id: 1,
      title: 'Traditional Weaving Workshop',
      description: 'Learn the art of traditional weaving from expert artisans.',
      date: new Date('2024-11-12'),
      type: 'workshop',
      status: 'approved',
      createdAt: new Date('2024-01-15'),
      location: 'Art Center',
      image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 2,
      title: 'Handicraft Exhibition',
      description: 'Showcase of local handicrafts and artisanal products.',
      date: new Date('2024-12-05'),
      type: 'exhibition',
      status: 'approved',
      createdAt: new Date('2024-01-20'),
      location: 'City Gallery',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    },
  ];

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'rejected': return '#F44336';
      default: return '#757575';
    }
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderHorizontalSection = (title, data, renderItem) => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScrollView}
        contentContainerStyle={styles.horizontalContentContainer}
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('EventDetailsArt', { event: item })}
          >
            {renderItem(item)}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity style={styles.languageButton}>
          <Ionicons name="language-outline" size={20} color="#6B4EFF" />
          <Text style={styles.languageText}>भाषा बदलें</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={24} color="#6B4EFF" />
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events Section */}
        {renderHorizontalSection('Upcoming Events', events, (event) => (
          <View style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDetails}>
                {formatDate(event.date)}, {event.location}
              </Text>
              <View style={styles.eventTags}>
                <View style={[styles.tag, { backgroundColor: getStatusColor(event.status) + '20' }]}>
                  <Text style={[styles.tagText, { color: getStatusColor(event.status) }]}>
                    {event.status}
                  </Text>
                </View>
                <View style={styles.tag}>
                  <Ionicons name="calendar-outline" size={12} color="#6B4EFF" />
                  <Text style={styles.tagText}>{event.type}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Create Event Button */}
        <TouchableOpacity 
          style={styles.createEventButton}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Text style={styles.createEventText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:50
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0EEFF',
  },
  languageText: {
    marginLeft: 4,
    color: '#6B4EFF',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    color: '#6B4EFF',
    fontSize: 14,
  },
  horizontalScrollView: {
    paddingLeft: 16,
  },
  horizontalContentContainer: {
    paddingRight: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F0EEFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  
  eventCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#6B4EFF',
  },
  createEventButton: {
    backgroundColor: '#6B4EFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createEventText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventScreenArt;