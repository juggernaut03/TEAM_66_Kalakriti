import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

const colors = {
  primary: '#8C5E58',
  background: '#F5F2ED',
  text: '#2A2922',
  muted: '#A49B8F',
};

const ArtisanCard = ({ artisan, onPress }) => (
  <TouchableOpacity 
    style={styles.card}
    onPress={() => onPress(artisan)}
  >
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.artisanName}>{artisan.name}</Text>
        <Text style={styles.artisanEmail}>{artisan.email}</Text>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: artisan.status === 'active' ? '#4CAF50' : '#FFA000' }
      ]}>
        <Text style={styles.statusText}>{artisan.status}</Text>
      </View>
    </View>

    <View style={styles.cardFooter}>
      <View style={styles.dateContainer}>
        <Icon name="event" size={16} color={colors.muted} />
        <Text style={styles.dateText}>
          Joined {new Date(artisan.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.requestButton}
        onPress={() => onPress(artisan)}
      >
        <Icon name="design-services" size={20} color="#FFF" />
        <Text style={styles.buttonText}>Request Design</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const ArtisansList = ({ navigation }) => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArtisans = async () => {
    try {
      const response = await api.get('/api/auth/getArtisans');
      console.log('Fetched artisans:', response.data);
      setArtisans(response.data);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Artisans</Text>
        <Text style={styles.headerSubtitle}>Find skilled craftspeople</Text>
      </View>

      <FlatList
        data={artisans}
        renderItem={({ item }) => (
          <ArtisanCard
            artisan={item}
            onPress={(artisan) => {
              navigation.navigate('RequestDesign', {
                artisanId: artisan._id, // Use artisan._id instead of selectedArtisan.id
                artisanName: artisan.name // Use artisan.name instead of selectedArtisan.name
              });
                  
            }}
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={fetchArtisans}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people" size={48} color={colors.muted} />
            <Text style={styles.emptyText}>No artisans available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  artisanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  artisanEmail: {
    fontSize: 14,
    color: colors.muted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    color: colors.muted,
    fontSize: 14,
  },
  requestButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.muted,
  },
});

export default ArtisansList;