import React, { useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../../navigation/index';
import { WishlistContext } from '../../navigation/WishlistContext';

const { width } = Dimensions.get('window');

const renderImage = (imageBase64) => {
  // Check if image is already a URL from Cloudinary
  if (imageBase64.startsWith('http')) {
    return imageBase64;
  }
  // Otherwise convert base64 to proper format
  return `data:image/jpeg;base64,${imageBase64}`;
};

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const handleAddToCart = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Product Name at the Top */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{product.name}</Text>
          <TouchableOpacity
            style={[
              styles.wishlistIcon,
              {
                backgroundColor: isInWishlist(product._id)
                  ? 'rgba(140, 94, 88, 0.2)' // Dark brown background if wishlisted
                  : 'rgba(255, 255, 255, 0.2)', // White background otherwise
              },
            ]}
            onPress={toggleWishlist}
          >
            <Icon
              name={isInWishlist(product._id) ? 'favorite' : 'favorite-border'}
              size={24}
              color={isInWishlist(product._id) ? '#8C5E' : '#fff'} // Dark brown if wishlisted, white otherwise
            />
          </TouchableOpacity>
        </View>

        {/* Image Carousel */}
        <View style={styles.swiperContainer}>
          <Swiper
            style={styles.swiper}
            showsButtons={false}
            autoplay
            autoplayTimeout={3}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
          >
            {product.images &&
              product.images.map((image, index) => (
                <View key={index} style={styles.slide}>
                  <Image
                    source={{ uri: renderImage(image) }}
                    style={styles.slideImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
          </Swiper>
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.priceRatingContainer}>
            <Text style={styles.productPrice}>₹{product.price}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#E3B448" />
              <Text style={styles.ratingText}>{product.rating || 0}</Text>
              <Text style={styles.reviewCount}>({product.reviews || 0} reviews)</Text>
            </View>
          </View>

          <Text style={styles.productCategory}>{product.category}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Icon name="shopping-cart" size={24} color="#8C5E58" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  scrollContainer: {
    paddingBottom: 100, // Extra space for the bottom buttons
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8C5E58',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  wishlistIcon: {
    borderRadius: 20,
    padding: 8,
  },
  swiperContainer: {
    height: 300,
    marginTop: 10, // Adjusted margin
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  swiper: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#8C5E58',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C5E58',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2922',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#A49B8F',
    marginLeft: 4,
  },
  productCategory: {
    fontSize: 16,
    color: '#8C5E58',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F2ED',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8C5E58',
    marginLeft: 8,
  },
  buyNowButton: {
    backgroundColor: '#8C5E58',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default ProductDetailsScreen;