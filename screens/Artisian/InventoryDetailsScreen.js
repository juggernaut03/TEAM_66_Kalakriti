import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const InventoryDetailsScreen = ({ route, navigation }) => {
  // Get the product data from the navigation route
  const { productId } = route.params;

  // Find the product in the dummy data (replace with API call in real app)
  const product = dummyProducts.find((p) => p._id === productId);

  // If the product is not found, show an error message
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Details</Text>
        <View style={{ width: 30 }} /> {/* Placeholder for alignment */}
      </View>

      {/* Product Image */}
      <Image
        source={{ uri: product.images[0] }}
        style={styles.productImage}
        resizeMode="cover"
      />

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>₹{product.price}</Text>
        <Text style={styles.productStock}>
          {product.stock} in stock
        </Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity
  style={styles.editButton}
  onPress={() => navigation.navigate('EditProduct', { productId: product._id })}
>
  <Text style={styles.editButtonText}>Edit Product</Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Dummy data for products (same as in InventoryScreen)
const dummyProducts = [
  {
    _id: '1',
    name: 'Handcrafted Pot',
    price: 1200,
    stock: 5,
    images: ['https://via.placeholder.com/150'],
    description: 'A beautiful handcrafted pot.',
  },
  {
    _id: '2',
    name: 'Wooden Sculpture',
    price: 2500,
    stock: 3,
    images: ['https://via.placeholder.com/150'],
    description: 'A unique wooden sculpture.',
  },
  {
    _id: '3',
    name: 'Bidriware Art',
    price: 1800,
    stock: 10,
    images: ['https://via.placeholder.com/150'],
    description: 'Traditional Bidriware art piece.',
  },
  {
    _id: '4',
    name: 'Stone Carving',
    price: 3000,
    stock: 2,
    images: ['https://via.placeholder.com/150'],
    description: 'Exquisite stone carving.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#D2B48C', // Tan header background
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 35
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513', // Brown text
  },
  productImage: {
    width: '100%',
    height: width * 0.8, // 80% of screen width
    marginTop: 16,
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513', // Brown text
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: '#4CAF50', // Green price
    marginBottom: 8,
  },
  productStock: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#8B4513', // Brown button
    padding: 16,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF4444', // Red button
    padding: 16,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default InventoryDetailsScreen;