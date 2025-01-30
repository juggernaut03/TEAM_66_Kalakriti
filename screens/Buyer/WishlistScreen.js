// WishlistScreen.js
import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WishlistContext } from '../../navigation/WishlistContext';

const WishlistScreen = ({ navigation }) => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.wishlistImage} />
        <View style={styles.wishlistInfo}>
          <Text style={styles.wishlistName}>{item.name}</Text>
          <Text style={styles.wishlistPrice}>₹{item.price}</Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {/* Add to cart logic here */}}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromWishlist(item.id)}
        >
          <Icon name="delete" size={24} color="#8C5E58" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {wishlist.length > 0 ? (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F2ED',
  },
  wishlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Increased elevation for better shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
  },
  wishlistImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  wishlistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  wishlistName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A2922',
  },
  wishlistPrice: {
    fontSize: 14,
    color: '#8C5E58',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#8C5E58',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#8C5E58',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#8C5E58',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default WishlistScreen;
