// EventRegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Checkbox } from 'expo-checkbox'; // Import Checkbox from expo-checkbox

const EventRegisterScreen = ({ route }) => {
  const { eventName } = route.params; // Get the event name from navigation parameters

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numAttendees, setNumAttendees] = useState(1);
  const [isViewer, setIsViewer] = useState(true);
  const [isPresenter, setIsPresenter] = useState(false);
  const [presentationTitle, setPresentationTitle] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRegistration = () => {
    // Handle registration logic here
    console.log('Registration Data:', {
      fullName,
      email,
      phone,
      numAttendees,
      isViewer,
      isPresenter,
      presentationTitle,
      creditCardNumber,
      expirationDate,
      cvv,
      termsAccepted,
    });
    // Clear form or navigate to another screen after registration
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Register for {eventName}</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Attendees"
        value={String(numAttendees)}
        onChangeText={(text) => setNumAttendees(Number(text))}
        keyboardType="numeric"
      />

      <Text style={styles.participationHeader}>Will you participate as a:</Text>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isViewer}
          onValueChange={() => {
            setIsViewer(true);
            setIsPresenter(false);
          }}
          color="#8C5E58" // Optional: Change color of the checkbox
        />
        <Text style={styles.checkboxLabel}>Viewer</Text>
        
        <Checkbox
          value={isPresenter}
          onValueChange={() => {
            setIsPresenter(true);
            setIsViewer(false);
          }}
          color="#8C5E58" // Optional: Change color of the checkbox
        />
        <Text style={styles.checkboxLabel}>Presenter</Text>
        
        {isPresenter && (
          <TextInput
            style={styles.input}
            placeholder="Presentation Title"
            value={presentationTitle}
            onChangeText={setPresentationTitle}
          />
        )}
      </View>

      <Text style={styles.paymentHeader}>Payment Information (if applicable):</Text>
      <TextInput
        style={styles.input}
        placeholder="Credit Card Number"
        value={creditCardNumber}
        onChangeText={setCreditCardNumber}
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.expirationInput]}
          placeholder="MM/YY"
          value={expirationDate}
          onChangeText={setExpirationDate}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.cvvInput]}
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.termsContainer}>
        <Checkbox
          value={termsAccepted}
          onValueChange={() => setTermsAccepted(!termsAccepted)}
          color="#8C5E58" // Optional: Change color of the checkbox
        />
        <Text style={styles.termsLabel}>      I agree to the terms and conditions.</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, !termsAccepted && styles.disabledButton]} 
        disabled={!termsAccepted} 
        onPress={handleRegistration}>
        <Text style={styles.buttonText}>Complete Registration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F2ED',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  participationHeader: {
    fontSize: 16,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    marginRight: 16,
    fontSize: 16,
    color: '#2A2922',
  },
  paymentHeader: {
    fontSize: 16,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  expirationInput: {
    flex: 1,
    marginRight: 8,
  },
  cvvInput: {
    flex: 1,
    marginLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsLabel: {
    fontSize: 16,
    color: '#2A2922',
    marginLeft: -8, // Adjust for better alignment with checkbox
   },
   button:{
     backgroundColor:'#8C5E58',
     borderRadius :8 ,
     paddingVertical :12 ,
     alignItems:'center'
   },
   buttonText:{
     color:'#fff',
     fontWeight:'bold'
   },
   disabledButton:{
     backgroundColor:'#ccc'
   }
});

// Export the main component
export default EventRegisterScreen;
