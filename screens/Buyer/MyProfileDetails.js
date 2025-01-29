import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';

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

const MyProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '********',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form data from Redux state when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        password: '********',
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password if it was changed
      if (formData.password !== '********') {
        updateData.password = formData.password;
      }

      const response = await api.put('/api/auth/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Update Redux store with new user data
        dispatch({ 
          type: 'UPDATE_USER_PROFILE',
          payload: response.data.user
        });

        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Icon name="account-circle" size={80} color={colors.primary} />
        <Text style={styles.headerText}>My Profile</Text>
        {formData.role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{formData.role}</Text>
          </View>
        )}
      </View>

      {/* Form Fields */}
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          editable={isEditing}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          editable={isEditing}
          keyboardType="email-address"
          placeholder="Enter your email"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          editable={isEditing}
          secureTextEntry={!isEditing}
          placeholder="Enter new password"
        />
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setIsEditing(false);
            setFormData({
              name: user.name || '',
              email: user.email || '',
              role: user.role || '',
              password: '********',
            });
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  roleBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  roleText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: colors.muted,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: colors.warning,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});

export default MyProfilePage;