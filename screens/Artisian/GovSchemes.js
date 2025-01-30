import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Linking } from 'react-native';
const schemesData = [
  {
    id: '1',
    title: 'PMEGP (Prime Minister Employment Generation Programme)',
    eligibility: 'Age: 18+ years, Education: 8th pass for projects above ₹10 lakh',
    benefits: 'Up to 35% subsidy for general category, 45% for special category',
    details: 'Provides financial assistance to set up new manufacturing, trading or service enterprises',
    documents: ['Aadhar Card', 'PAN Card', 'Bank Account', 'Educational Certificates', 'Caste Certificate (if applicable)'],
    maxAmount: '₹25 lakh for manufacturing, ₹10 lakh for service sector',
    icon: 'https://via.placeholder.com/40',
  },
  {
    id: '2',
    title: 'SFURTI (Scheme of Fund for Regeneration of Traditional Industries)',
    eligibility: 'Traditional artisans, craft clusters with 500+ beneficiaries',
    benefits: 'Up to ₹2.5 crore for regular clusters, training and equipment support',
    details: 'Helps organize traditional industries and artisans into clusters to make them competitive',
    documents: ['Artisan ID Card', 'Cluster Proposal', 'Local Body Registration'],
    maxAmount: '₹2.5 crore for regular clusters',
    icon: 'https://via.placeholder.com/40/FF6B6B',
  },
  {
    id: '3',
    title: 'Vishwakarma Yojana',
    eligibility: 'Traditional craftspeople and artisans',
    benefits: 'Free toolkit up to ₹10,000, skill development training',
    details: 'Provides modern tools, training, and marketing support to traditional craftspeople',
    documents: ['Artisan Card', 'Aadhar Card', 'Bank Account', 'Craft Certification'],
    maxAmount: '₹10,000 for tools + training benefits',
    icon: 'https://via.placeholder.com/40/4ECDC4',
  },
  {
    id: '4',
    title: 'MUDRA Loan Yojana',
    eligibility: 'Small business owners, artisans, individual entrepreneurs',
    benefits: 'Collateral-free loans under Shishu, Kishor, and Tarun categories',
    details: 'Provides loans up to ₹10 lakh for small business development',
    documents: ['Identity Proof', 'Address Proof', 'Business Plan', 'Bank Statement'],
    maxAmount: 'Shishu: ₹50,000, Kishor: ₹5 lakh, Tarun: ₹10 lakh',
    icon: 'https://via.placeholder.com/40/FFD93D',
  },
];

const SchemeItem = ({ scheme, onPress }) => (
  <TouchableOpacity style={styles.schemeItem} onPress={() => onPress(scheme)}>
    <Image source={{ uri: scheme.icon }} style={styles.schemeIcon} />
    <View style={styles.schemeTextContainer}>
      <Text style={styles.schemeTitle}>{scheme.title}</Text>
      <Text style={styles.schemeEligibility}>{scheme.eligibility}</Text>
      <Text style={styles.schemeBenefits}>{scheme.benefits}</Text>
    </View>
  </TouchableOpacity>
);

const SchemeDetailsModal = ({ visible, scheme, onClose }) => {
  if (!scheme) return null;

  const handleGetHelp = () => {
    Linking.openURL('https://indian.handicrafts.gov.in/en').catch(err => console.error("Failed to open URL:", err));
  };
  
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{scheme.title}</Text>
          
          <ScrollView style={styles.modalScroll}>
            <View style={styles.detailSection}>
              <Text style={styles.detailHeader}>पात्रता (Eligibility):</Text>
              <Text style={styles.detailText}>{scheme.eligibility}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailHeader}>लाभ (Benefits):</Text>
              <Text style={styles.detailText}>{scheme.benefits}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailHeader}>विवरण (Details):</Text>
              <Text style={styles.detailText}>{scheme.details}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailHeader}>आवश्यक दस्तावेज (Required Documents):</Text>
              {scheme.documents.map((doc, index) => (
                <Text key={index} style={styles.documentItem}>• {doc}</Text>
              ))}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailHeader}>अधिकतम राशि (Maximum Amount):</Text>
              <Text style={styles.detailText}>{scheme.maxAmount}</Text>
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.helpButton} onPress={handleGetHelp}>
              <Text style={styles.helpButtonText}>सहायता प्राप्त करें (Get Help)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>बंद करें (Close)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const GovSchemes = () => {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSchemePress = (scheme) => {
    setSelectedScheme(scheme);
    setModalVisible(true);
  };

  const handleApplyNow = () => {
    Linking.openURL('https://handicrafts.nic.in/schemes.aspx').catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>सरकारी योजनाएं{'\n'}Government Schemes</Text>
        <TouchableOpacity style={styles.helpIconButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {schemesData.map((scheme) => (
          <SchemeItem
            key={scheme.id}
            scheme={scheme}
            onPress={handleSchemePress}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.applyButton} onPress={handleApplyNow}>
        <Text style={styles.applyButtonText}>आवेदन करें (Apply Now)</Text>
      </TouchableOpacity>

      <SchemeDetailsModal
        visible={modalVisible}
        scheme={selectedScheme}
        onClose={() => setModalVisible(false)}
      />

   
    </View>
  );
};

const styles = StyleSheet.create({
    // Main Container Styles
    container: {
      flex: 1,
      backgroundColor: '#F5F2ED', // Project background color
    },
    
    // Header Styles
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: 48,
      backgroundColor: '#8C5E58', // Project primary color
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    helpIconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    // Scroll View
    scrollView: {
      flex: 1,
    },
  
    // Scheme Item Styles
    schemeItem: {
      flexDirection: 'row',
      padding: 16,
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    schemeIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: '#D4AA7D', // Project secondary color
    },
    schemeTextContainer: {
      flex: 1,
    },
    schemeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2A2922', // Project text color
      marginBottom: 4,
    },
    schemeEligibility: {
      fontSize: 14,
      color: '#A49B8F', // Project muted text color
      marginBottom: 2,
    },
    schemeBenefits: {
      fontSize: 14,
      color: '#8C5E58', // Project primary color
    },
  
    // Modal Styles
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2A2922',
      marginBottom: 16,
      textAlign: 'center',
    },
    modalScroll: {
      maxHeight: '70%',
    },
  
    // Detail Section Styles
    detailSection: {
      marginBottom: 16,
    },
    detailHeader: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#8C5E58', // Project primary color
    },
    detailText: {
      fontSize: 14,
      lineHeight: 20,
      color: '#2A2922', // Project text color
    },
    documentItem: {
      fontSize: 14,
      lineHeight: 20,
      color: '#2A2922',
      marginLeft: 8,
      paddingVertical: 4,
    },
  
    // Button Styles
    modalButtons: {
      marginTop: 16,
    },
    helpButton: {
      backgroundColor: '#8C5E58', // Project primary color
      padding: 14,
      borderRadius: 12,
      marginBottom: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    helpButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    closeButton: {
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#8C5E58',
    },
    closeButtonText: {
      color: '#8C5E58',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    applyButton: {
      backgroundColor: '#8C5E58',
      margin: 16,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    applyButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  
    // Navigation Styles
    bottomNav: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      backgroundColor: '#FFFFFF',
      paddingBottom: 20,
      elevation: 8,
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      padding: 12,
    },
    navIcon: {
      width: 24,
      height: 24,
      tintColor: '#A49B8F', // Project muted color
    },
    activeNavIcon: {
      tintColor: '#8C5E58', // Project primary color
    },
    navText: {
      fontSize: 12,
      color: '#A49B8F',
      marginTop: 4,
    },
    activeNavText: {
      color: '#8C5E58', // Project primary color
    }
  });
  export default GovSchemes;