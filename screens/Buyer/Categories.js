import React, { useState, useEffect } from 'react';
import { 
 View, 
 Text, 
 StyleSheet, 
 FlatList, 
 TouchableOpacity, 
 Image, 
 TextInput, 
 ScrollView,
 ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

const CategoriesScreen = ({ navigation }) => {
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [filteredCategories, setFilteredCategories] = useState([]);

 useEffect(() => {
   fetchCategories();
 }, []);

 useEffect(() => {
   filterCategories();
 }, [searchQuery, categories]);

 const fetchCategories = async () => {
   try {
     const response = await api.get('/api/categories');
     setCategories(response.data);
     setFilteredCategories(response.data);
   } catch (error) {
     console.error('Error fetching categories:', error);
   } finally {
     setLoading(false);
   }
 };

 const filterCategories = () => {
   const filtered = categories.filter(category =>
     category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     category.description.toLowerCase().includes(searchQuery.toLowerCase())
   );
   setFilteredCategories(filtered);
 };

 const renderCategory = ({ item }) => (
   <TouchableOpacity
     style={styles.categoryCard}
     activeOpacity={0.8}
     onPress={() => navigation.navigate('ProductList', { category: item })}
   >
     <Image 
       source={{ uri: item.icon }} 
       style={styles.categoryIcon}
       defaultSource={require('../../assets/image.png')}
     />
     <Text style={styles.categoryText}>{item.name}</Text>
     <Text style={styles.categoryDescription}>{item.description}</Text>
     <Text style={styles.categoryProducts}>{item.products} products</Text>
   </TouchableOpacity>
 );

 if (loading) {
   return (
     <View style={styles.loadingContainer}>
       <ActivityIndicator size="large" color="#8C5E58" />
     </View>
   );
 }

 return (
   <View style={styles.container}>
     <ScrollView contentContainerStyle={styles.scrollContainer}>
       {/* Header */}
       <View style={styles.header}>
         <Text style={styles.headerText}>Explore Categories</Text>
         <Text style={styles.headerSubtext}>
           Discover unique handcrafted items from rural artisans
         </Text>
       </View>

       {/* Search Bar */}
       <View style={styles.searchContainer}>
         <TextInput
           style={styles.searchInput}
           placeholder="Search categories..."
           placeholderTextColor="#888"
           value={searchQuery}
           onChangeText={setSearchQuery}
         />
         <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
       </View>

       {/* Categories Grid */}
       {filteredCategories.length > 0 ? (
         <FlatList
           data={filteredCategories}
           renderItem={renderCategory}
           keyExtractor={(item) => item._id}
           numColumns={2}
           contentContainerStyle={styles.grid}
           scrollEnabled={false}
         />
       ) : (
         <Text style={styles.noResults}>No categories found</Text>
       )}

       {/* Featured Banner */}
       <View style={styles.featuredBanner}>
         <Text style={styles.featuredText}>Featured Artisan: Ramesh Pottery</Text>
         <Text style={styles.featuredSubtext}>
           Explore the exquisite pottery collection from Jaipur, Rajasthan.
         </Text>
         <TouchableOpacity style={styles.featuredButton}>
           <Text style={styles.featuredButtonText}>View Collection</Text>
         </TouchableOpacity>
       </View>
     </ScrollView>
   </View>
 );
};

const styles = StyleSheet.create({
 loadingContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#F5F2ED'
 },
 container: {
   flex: 1,
   backgroundColor: '#F5F2ED',
 },
 scrollContainer: {
   padding: 16,
 },
 header: {
   marginBottom: 24,
 },
 headerText: {
   fontSize: 28,
   fontWeight: 'bold',
   color: '#2A2922',
   textAlign: 'center',
 },
 headerSubtext: {
   fontSize: 14,
   color: '#666',
   textAlign: 'center',
   marginTop: 8,
 },
 searchContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   backgroundColor: '#fff',
   borderRadius: 10,
   paddingHorizontal: 16,
   marginBottom: 24,
   elevation: 3,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
 },
 searchInput: {
   flex: 1,
   fontSize: 16,
   color: '#333',
   paddingVertical: 12,
 },
 searchIcon: {
   marginLeft: 8,
 },
 grid: {
   justifyContent: 'space-between',
 },
 categoryCard: {
   flex: 1,
   margin: 8,
   backgroundColor: '#fff',
   borderRadius: 12,
   elevation: 3,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   alignItems: 'center',
   padding: 16,
 },
 categoryIcon: {
   width: 60,
   height: 60,
   marginBottom: 10,
   resizeMode: 'contain',
 },
 categoryText: {
   fontSize: 18,
   fontWeight: '600',
   color: '#2A2922',
   textAlign: 'center',
   marginBottom: 4,
 },
 categoryDescription: {
   fontSize: 12,
   color: '#666',
   textAlign: 'center',
   marginBottom: 8,
 },
 categoryProducts: {
   fontSize: 12,
   color: '#8C5E58',
   fontWeight: '500',
 },
 noResults: {
   textAlign: 'center',
   fontSize: 16,
   color: '#666',
   marginTop: 20,
 },
 featuredBanner: {
   backgroundColor: '#8C5E58',
   borderRadius: 12,
   padding: 16,
   marginTop: 24,
   elevation: 3,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
 },
 featuredText: {
   fontSize: 18,
   fontWeight: '600',
   color: '#fff',
   textAlign: 'center',
 },
 featuredSubtext: {
   fontSize: 14,
   color: '#fff',
   textAlign: 'center',
   marginTop: 8,
 },
 featuredButton: {
   backgroundColor: '#fff',
   borderRadius: 8,
   padding: 12,
   marginTop: 16,
   alignItems: 'center',
 },
 featuredButtonText: {
   fontSize: 16,
   fontWeight: '600',
   color: '#8C5E58',
 },
});

export default CategoriesScreen;