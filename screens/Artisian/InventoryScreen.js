import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, Platform } from 'react-native';

const colors = {
  primary: '#8C5E58',
  secondary: '#D4AA7D',
  accent: '#E3B448',
  text: '#2A2922',
  background: '#F5F2ED',
  muted: '#A49B8F',
  success: '#4CAF50',
  warning: '#FFA000',
  white: '#FFFFFF'
};

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // Two items per row with padding

// Dummy data for products
const dummyProducts = [
  {
    _id: '1',
    name: 'Handcrafted Pot',
    price: 1200,
    stock: 5,
    images: ['https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/6720431f7b5ddf0161843939/1-640x640.png'],
    description: 'A beautiful handcrafted pot.',
  },
  {
    _id: '2',
    name: 'Wooden Sculpture',
    price: 2500,
    stock: 3,
    images: ['https://i.etsystatic.com/19076644/r/il/b4976e/3079331372/il_fullxfull.3079331372_7uop.jpg'],
    description: 'A unique wooden sculpture.',
  },
  {
    _id: '3',
    name: 'Bidriware Art',
    price: 1800,
    stock: 10,
    images: ['https://s3.ap-southeast-1.amazonaws.com/gounesco.com/wp-content/uploads/2014/05/11160638/BIDRIWARE-ARTISTS-AN-EXQUISITE-PIECE-OF-VASE.jpg'],
    description: 'Traditional Bidriware art piece.',
  },
  {
    _id: '4',
    name: 'Stone Carving',
    price: 3000,
    stock: 2,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSQaxKok1tqdrxVMcgr6p1ZGyVBF4GpQuPfg&s'],
    description: 'Exquisite stone carving.',
  },
];

const InventoryScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate fetching products
  const fetchProducts = () => {
    setLoading(true);
    setTimeout(() => {
      setProducts(dummyProducts); // Use dummy data
      setLoading(false);
      setRefreshing(false);
    }, 1000); // Simulate a 1-second delay
  };

  // Refresh the product list
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Render each product item
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('InventoryDetails', { productId: item._id })}
    >
      <Image
        source={{ uri: item.images[0] }} // Display the first image
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <Text style={styles.productStock}>
          {item.stock} in stock
        </Text>
      </View>
    </TouchableOpacity>
  );

   // Show loading indicator while fetching data
   if (loading) {
     return (
       <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color="#8B4513" />
       </View>
     );
   }

   return (
     <View style={styles.container}>
       {/* Header */}
       <View style={styles.header}>
         <View style={styles.headerContent}>
           <Text style={styles.headerTitle}>My Inventory</Text>
           <TouchableOpacity
             style={styles.addButton}
             onPress={() => navigation.navigate('AddProduct')}
           >
             <Icon name="add-circle" size={30} color="#8B4513" />
           </TouchableOpacity>
         </View>
       </View>

       {/* Product List */}
       <FlatList
         data={products}
         renderItem={renderProductItem}
         keyExtractor={(item) => item._id}
         numColumns={2}
         columnWrapperStyle={styles.row}
         refreshControl={
           <RefreshControl
             refreshing={refreshing}
             onRefresh={handleRefresh}
             colors={[colors.primary]}
           />
         }
         ListEmptyComponent={
           <View style={styles.emptyContainer}>
             <Icon name="inventory" size={50} color="#8B4513" />
             <Text style={styles.emptyText}>No products found</Text>
           </View>
         }
       />
     </View>
   );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
 },

 // Header Styles
 header: {
   backgroundColor: colors.primary,
   paddingTop: Platform.OS === 'ios' ? 60 : 40,
   paddingBottom: Platform.OS === 'ios' ? 20 : 15,
   borderBottomLeftRadius: 24,
   borderBottomRightRadius: 24,
   elevation: 3,
 },

 headerContent: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between', // Ensure space between title and button
   paddingHorizontal: 20, // Add padding for spacing
 },

 headerTitle: {
   fontSize: 24,
   fontWeight: 'bold',
   color: colors.white,
 },

 addButton: {
   width: 44,
   height: 44,
   borderRadius: 22,
   backgroundColor: colors.white,
   justifyContent: 'center',
   alignItems: 'center',
   elevation: 3,
 },

 // List Container Styles
 row:{
   justifyContent:'space-between',
 },

 // Product Card Styles
 productItem:{
   width :ITEM_WIDTH,
   backgroundColor:'#FFFFFF',
   borderRadius :16,
   marginBottom :20,
   elevation :3,
   paddingTop:20,
 },
 productImage:{
   width :'100%',
   height :ITEM_WIDTH *0.75, // Adjusted height for better aspect ratio
 },
 productInfo:{
   padding :12, 
 },
 productName:{
   fontSize :16,
   fontWeight :'600',
 },
 productPrice:{
   fontSize :16,
   fontWeight :'bold',
 },
 productStock:{
   fontSize :14,
 },

 // Loading States
 loadingContainer:{
   flex :1,
   justifyContent :'center',
   alignItems :'center',
 },

 // Empty State
 emptyContainer:{
   flex :1,
   justifyContent :'center',
   alignItems :'center',
 },
 emptyText:{
   fontSize :16,
 },

});

export default InventoryScreen;
