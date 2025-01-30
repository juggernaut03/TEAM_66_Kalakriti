import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../../navigation/index'; // Correct import path
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const { width } = Dimensions.get('window');

const colors = {
  primary: '#8C5E58',
  secondary: '#D4AA7D',
  accent: '#E3B448',
  text: '#2A2922',
  background: '#F5F2ED',
  muted: '#A49B8F',
  success: '#4CAF50',
  warning: '#FFA000',
};

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext); // Use CartContext
  const [discountCode, setDiscountCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showProductDetails, setShowProductDetails] = useState(null);

  const navigation = useNavigation(); // Initialize navigation

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = 100;
  const grandTotal = subtotal + tax + shipping;

  const removeItem = (id) => {
    removeFromCart(id); // Use removeFromCart from CartContext
    setModalMessage('Item removed from cart.');
    setShowModal(true);
  };

  const renderProductDetails = (item) => (
    <Modal
      visible={showProductDetails === item.id}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowProductDetails(null)}
    >
      <View style={styles.productModalContainer}>
        <View style={styles.productModalContent}>
          <ScrollView>
            <Text style={styles.productModalTitle}>{item.name}</Text>
            <Image source={{ uri: item.image }} style={styles.productModalImage} />
            
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Artisan Details</Text>
              <Text style={styles.infoText}>Crafted by: {item.artisan}</Text>
              <Text style={styles.infoText}>Location: {item.location}</Text>
              <Text style={styles.infoText}>Time to Make: {item.timeToMake}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Product Information</Text>
              <Text style={styles.infoText}>Materials: {item.material}</Text>
              <Text style={styles.infoText}>Care: {item.careInstructions}</Text>
              <Text style={styles.infoText}>Certification: {item.certification}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Social Impact</Text>
              <Text style={styles.infoText}>{item.impact}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowProductDetails(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.artisan}>Sold by {item.artisan}</Text> {/* Display artisan name */}
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={12} color={colors.muted} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Text style={styles.certification}>{item.certification}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        
        <View style={styles.actionRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, false)}
              style={styles.quantityButton}
              disabled={item.quantity === 1} // Disable minus button when quantity is 1
            >
              <Icon name="remove" size={20} color={item.quantity === 1 ? colors.muted : '#fff'} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, true)}
              style={styles.quantityButton}
            >
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => setShowProductDetails(item.id)}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => removeFromCart(item._id)} style={styles.removeButton}>
            <Icon name="delete-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      {renderProductDetails(item)}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#8C5E58', '#D4AA7D']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Kalakriti Cart</Text>
          <Text style={styles.headerSubtitle}>Supporting Rural Artisans & Their Heritage</Text>
        </LinearGradient>

        {/* Cart Items */}
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.cartList}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="shopping-cart" size={48} color={colors.muted} />
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <Text style={styles.emptySubtext}>Discover unique handcrafted items and support local artisans</Text>
            </View>
          }
        />

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({cartItems.length})</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%)</Text>
            <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>₹{shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.totalLabel]}>Grand Total</Text>
            <Text style={styles.grandTotal}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Discount Code */}
        <View style={styles.discountContainer}>
          <TextInput
            style={styles.discountInput}
            placeholder="Enter discount code"
            value={discountCode}
            onChangeText={setDiscountCode}
          />
          <TouchableOpacity
            style={styles.discountButton}
            onPress={() => setModalMessage('Discount applied successfully.')}
          >
            <Text style={styles.discountButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Checkout Button */}
      <TouchableOpacity 
        style={styles.checkoutButton}
        onPress={() => navigation.navigate('Checkout', { cartItems })}// Navigate to CheckoutPage
      >
        <Icon name="lock" size={20} color="#fff" />
        <Text style={styles.checkoutText}>Secure Checkout</Text>
      </TouchableOpacity>

      {/* Modal for Messages */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: 100, // Space for the floating button
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  artisan: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 4,
  },
  certification: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    color: colors.text,
  },
  detailsButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailsButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.muted,
    marginVertical: 12,
  },
  discountContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  discountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  discountButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  discountButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  productModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  productModalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  productModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  productModalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cartItem: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    flexDirection: 'row', // Add this line to arrange image and details in a row
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16, // Add margin to create space between image and details
  },
  details: {
    flex: 1, // Add this line to allow details to expand and fill the remaining space
  },
});

export default CartPage;