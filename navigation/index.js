import React, { createContext, useState, useMemo, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import OnboardingScreen from '../screens/common/OnboardingScreen';
import AuthScreen from '../screens/common/AuthScreen';
import ArtisanDashboardTabs from '../screens/Artisian/ArtisanDashboard';
import BuyerHome from '../screens/Buyer/BuyerHome';
import AddProduct from '../screens/Artisian/AddProduct';
import ViewOrders from '../screens/Artisian/ViewOrders';
import Notifications from '../screens/common/Notifications';
import Wallet from '../screens/common/Wallet';
import RegisterScreen from '../screens/common/RegisterScreen';
import EarningsPage from '../screens/Artisian/Earn';
import InventoryScreen from '../screens/Artisian/InventoryScreen';
import InventoryDetailsScreen from '../screens/Artisian/InventoryDetailsScreen';
import EditProductScreen from '../screens/Artisian/EditProductScreen';
import OrderDetailsPage from '../screens/Artisian/OrderDetailsPage';
import Profile from '../screens/Buyer/Profile';
import Categories from '../screens/Buyer/Categories';
import TrendingProducts from '../screens/Buyer/TrendingProducts';
import ProductListScreen from '../screens/Buyer/ProductListScreen';
import ProductDetailsScreen from '../screens/Buyer/ProductDetailsScreen';
import WishlistScreen from '../screens/Buyer/WishlistScreen';
import { WishlistProvider } from '../navigation/WishlistContext'; // Import WishlistProvider
// Import OrderProvider and OrderContext
import { OrderProvider } from '../navigation/OrderContext'; // Adjust the path as needed
import CheckoutPage from '../screens/Buyer/CheckoutPage';
import ConfirmationPage from '../screens/Buyer/ConfirmationPage';
import CartPage from '../screens/Buyer/Cart';
import PaymentPage from '../screens/Buyer/PaymentPage';
import MyOrdersPage from '../screens/Buyer/MyOrdersPage';
import OrderStatusPage from '../screens/Buyer/OrderStatusPage';
import MyProfileDetails from '../screens/Buyer/MyProfileDetails';
import MySavedList from '../screens/Buyer/MySavedList';
import AddressBook from '../screens/Buyer/AddressBook';
import MySavedCards from '../screens/Buyer/MySavedCards';
import Help from '../screens/Buyer/Help';
import EventsScreen from '../screens/Buyer/EventsScreen';
import SkillsScreen from '../screens/Buyer/ SkillsScreen';
import EventRegisterScreen from '../screens/Buyer/EventRegisterScreen';
import SkillDevelopment from '../screens/Artisian/SkillDevelopment';
import GovSchemes from '../screens/Artisian/GovSchemes';
import Gamification from '../screens/Artisian/Gamification';
import EventScreenArt from '../screens/Artisian/EventScreenArt';
import EventDetailsScreen from '../screens/Artisian/EventDetails';
import DesignIdea from '../screens/Artisian/DesignIdea';



// Create a Cart Context
export const CartContext = createContext();

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart data from AsyncStorage when the app starts
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };
    loadCart();
  }, []);

  // Save cart data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    };
    saveCart();
  }, [cartItems]);

  const cartContextValue = useMemo(
    () => ({
      cartItems,
      addToCart: (product) => {
        const existingItem = cartItems.find((item) => item._id === product._id); // Use _id
        if (existingItem) {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
        }
      },
      removeFromCart: (id) => {
        console.log('Removing product with id:', id);
        console.log('Current cart items:', cartItems);
        setCartItems((prevItems) => {
          const updatedItems = prevItems.filter((item) => item._id !== id); // Use _id
          console.log('Updated cart items:', updatedItems);
          return updatedItems;
        });
      },
      updateQuantity: (id, increment) => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === id
              ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) }
              : item
          )
        );
      },
      clearCart: () => {
        setCartItems([]);
      },
    }),
    [cartItems]
  );
  return (
    <CartContext.Provider value={cartContextValue}>
      <WishlistProvider> {/* Wrap with WishlistProvider */}
      <OrderProvider> {/* Wrap with OrderProvider */}
        
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen
              name="ArtisanDashboard"
              component={ArtisanDashboardTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="BuyerHome" component={BuyerHome} />
            
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen
  name="Profile"
  component={Profile}
  options={{ title: 'My Account' }} // Add a custom screen name here
/>
            <Stack.Screen name="AddProduct" component={AddProduct} />
            <Stack.Screen name="ViewOrders" component={ViewOrders} />
            <Stack.Screen name="Earnings" component={EarningsPage} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Wallet" component={Wallet} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="TrendingProducts" component={TrendingProducts} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name='Skills' component={SkillsScreen}/>
            <Stack.Screen name='EventReg' component={EventRegisterScreen}/>
            <Stack.Screen name='Skill' component={SkillDevelopment}/>
            <Stack.Screen name='GovnScn' component={GovSchemes}/>
            <Stack.Screen name='Game' component={Gamification}/>
            <Stack.Screen name="WishlistScreen" component={WishlistScreen}/>
            <Stack.Screen name="Cart" component={CartPage}/>
            <Stack.Screen name="Checkout" component={CheckoutPage} />
            <Stack.Screen name="Confirmation" component={ConfirmationPage} />
            <Stack.Screen name="Payment"component={PaymentPage}/>
            <Stack.Screen name="MyOrders"component={MyOrdersPage}/>
            <Stack.Screen name="OrderStatusPage"component={OrderStatusPage}/>
            <Stack.Screen name="Events"component={EventsScreen}/>
            <Stack.Screen name="EventArtisan"component={EventScreenArt}/>
            <Stack.Screen name="EventDetailsArt"component={EventDetailsScreen}/>
            <Stack.Screen name="MyProfileDetails" component={MyProfileDetails} />
            <Stack.Screen name="DesignIdea" component={DesignIdea} />
            
            <Stack.Screen name="MySavedList" component={MySavedList} />
            
            <Stack.Screen name="AddressBook" component={AddressBook} />
            <Stack.Screen name="MySavedCards" component={MySavedCards} />
            <Stack.Screen name="Help" component={Help} />
            <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
 <Stack.Screen
                name="OrderDetailsPage"
                component={OrderDetailsPage}
                options={{ headerShown: false }} // Add OrderDetailsPage to the stack
              />
              <Stack.Screen
                name="InventoryDetails"
                component={InventoryDetailsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditProduct"
                component={EditProductScreen}
                options={{ headerShown: false }}
              />
 </Stack.Navigator>

        </NavigationContainer>
        </OrderProvider>
      </WishlistProvider>
    </CartContext.Provider>
  );
};

export default AppNavigator;