import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const EventDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params;

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status color based on event status
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'rejected':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Event Image */}
        <Image 
          source={{ uri: event.image }} 
          style={styles.eventImage}
        />

        {/* Event Basic Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
              <Text style={styles.statusText}>{event.status}</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(event.date)}</Text>
          </View>

          {/* Event Type */}
          <View style={styles.typeContainer}>
            <Ionicons 
              name={
                event.type === 'workshop' ? 'construct-outline' :
                event.type === 'exhibition' ? 'eye-outline' : 'school-outline'
              } 
              size={20} 
              color="#6B4EFF" 
            />
            <Text style={styles.typeText}>{event.type}</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Location Info */}
          <View style={styles.locationContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color="#6B4EFF" />
              <Text style={styles.locationText}>{event.location}</Text>
            </View>
          </View>

          {/* Additional Details */}
          {event.language && (
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.detailRow}>
                <Ionicons name="language-outline" size={20} color="#6B4EFF" />
                <Text style={styles.detailText}>Language: {event.language}</Text>
              </View>
              {event.stipend && (
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={20} color="#6B4EFF" />
                  <Text style={styles.detailText}>Stipend: {event.stipend}</Text>
                </View>
              )}
            </View>
          )}

          {/* Created Date */}
          <Text style={styles.createdDate}>
            Created on {formatDate(event.createdAt)}
          </Text>
        </View>
      </ScrollView>

      {/* Register Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register for Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 50,
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B4EFF',
    textTransform: 'capitalize',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  createdDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  registerButton: {
    backgroundColor: '#6B4EFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailsScreen;