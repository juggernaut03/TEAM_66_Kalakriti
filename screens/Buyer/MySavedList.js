// WishlistScreen.js
import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WishlistContext } from '../../navigation/WishlistContext';

const WishlistScreen = ({ navigation }) => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  const renderWishlistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.wishlistItem}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.wishlistImage} />
      <View style={styles.wishlistInfo}>
        <Text style={styles.wishlistName}>{item.name}</Text>
        <Text style={styles.wishlistPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromWishlist(item.id)}
      >
        <Icon name="delete" size={24} color="#8C5E58" />
      </TouchableOpacity>
    </TouchableOpacity>
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
    elevation: 2,
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
  },
  removeButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8C5E58',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default WishlistScreen;