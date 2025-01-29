import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const AddressPage = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Home',
      address: '123, Main Street, Jaipur, Rajasthan, 302001',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      address: '456, Business Park, Udaipur, Rajasthan, 313001',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddressName, setNewAddressName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // Function to set an address as default
  const setDefaultAddress = (id) => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));
    setAddresses(updatedAddresses);
    Alert.alert('Default Address', 'Default address updated successfully.');
  };

  // Function to delete an address
  const deleteAddress = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedAddresses = addresses.filter((address) => address.id !== id);
            setAddresses(updatedAddresses);
            Alert.alert('Address Deleted', 'Address deleted successfully.');
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Function to handle adding a new address
  const handleAddAddress = () => {
    if (!newAddressName || !newAddress) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newAddressItem = {
      id: String(addresses.length + 1),
      name: newAddressName,
      address: newAddress,
      isDefault: false,
    };

    setAddresses([...addresses, newAddressItem]);
    setNewAddressName('');
    setNewAddress('');
    setShowAddForm(false);
    Alert.alert('Success', 'Address added successfully.');
  };

  // Function to handle address selection
  const handleSelectAddress = (address) => {
    navigation.navigate('Checkout', { selectedAddress: address });
  };

  // Render each address item
  const renderAddressItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectAddress(item)}>
      <View style={styles.addressItem}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressName}>{item.name}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText}>{item.address}</Text>
        <View style={styles.addressActions}>
          <TouchableOpacity onPress={() => setDefaultAddress(item.id)}>
            <Text style={styles.actionText}>Set as Default</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteAddress(item.id)}>
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Address Form */}
      {showAddForm && (
        <View style={styles.addAddressForm}>
          <TextInput
            style={styles.input}
            placeholder="Address Name (e.g., Home, Office)"
            value={newAddressName}
            onChangeText={setNewAddressName}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Address"
            value={newAddress}
            onChangeText={setNewAddress}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
            <Text style={styles.addButtonText}>Add Address</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddForm(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Address Button */}
      {!showAddForm && (
        <TouchableOpacity style={styles.addAddressButton} onPress={() => setShowAddForm(true)}>
          <Icon name="add" size={24} color={colors.background} />
          <Text style={styles.addAddressButtonText}>Add New Address</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  addressItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  defaultBadge: {
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: colors.background,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 12,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteText: {
    color: colors.warning,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 3,
  },
  addAddressButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    marginLeft: 8,
  },
  addAddressForm: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  cancelButton: {
    backgroundColor: colors.warning,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});

export default AddressPage;