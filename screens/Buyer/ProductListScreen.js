import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'; // For better image performance
import api from '../../services/api';

const { width } = Dimensions.get('window');

const ProductListScreen = ({ route, navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { category } = route.params;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products?category=${category.name}`);
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProductImage = (imageUrl) => {
    // Handle different image formats
    if (!imageUrl) {
      return (
        <View style={styles.placeholderImage}>
          <Icon name="image" size={50} color="#ccc" />
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      );
    }

    // Check if image is base64 or URL
    const imageSource = imageUrl.startsWith('http') 
      ? { uri: imageUrl }
      : { uri: `data:image/jpeg;base64,${imageUrl}` };

    return (
      <FastImage
        style={styles.productImage}
        source={imageSource}
        resizeMode={FastImage.resizeMode.cover}
        fallback={true} // Fallback to Image for web
        defaultSource={require('../../assets/image.png')} // Placeholder
      />
    );
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      {renderProductImage(item.images?.[0])}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#E3B448" />
          <Text style={styles.ratingText}>{item.rating || 0}</Text>
          <Text style={styles.reviewCount}>({item.reviews || 0})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
          {item.stock <= 5 && (
            <Text style={styles.lowStockLabel}>
              Only {item.stock} left!
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8C5E58" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{category.name} Products</Text>
        <Text style={styles.headerSubtitle}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.productList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="shopping-bag" size={50} color="#8C5E58" />
            <Text style={styles.emptyText}>No products found in this category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  headerContainer: {
    backgroundColor: '#8C5E58',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    marginTop: 5,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    color: '#2A2922',
  },
  reviewCount: {
    fontSize: 14,
    color: '#A49B8F',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8C5E58',
  },
  lowStockLabel: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F2ED',
  },
  loadingText: {
    marginTop: 10,
    color: '#8C5E58',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8C5E58',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ProductListScreen;