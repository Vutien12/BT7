import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Import the custom component if you plan to use it
import CustomTextInput from './Component/CustomTextInput'; // Ensure the path is correct

// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Details')}
      >
        <Text style={styles.buttonText}>Go to Details</Text>
      </TouchableOpacity>
    </View>
  );
}

// Phone Number Input Component
const PhoneNumberInput = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to format phone number
  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    let formattedNumber = '';

    if (cleaned.startsWith('84')) {
      formattedNumber = '+84 ';
      const remaining = cleaned.slice(2);
      formattedNumber += formatRemainingNumber(remaining);
    } else if (cleaned.startsWith('0')) {
      formattedNumber = '0';
      const remaining = cleaned.slice(1);
      formattedNumber += formatRemainingNumber(remaining);
    } else {
      formattedNumber = cleaned;
    }

    return formattedNumber.trim();
  };

  const formatRemainingNumber = (number) => {
    const part1 = number.substring(0, 3);
    const part2 = number.substring(3, 6);
    const part3 = number.substring(6, 9);
    let formatted = part1;
    if (part2) formatted += ` ${part2}`;
    if (part3) formatted += ` ${part3}`;
    return formatted;
  };

  // Function to validate phone number
  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  };

  // Handle Continue button press
  const handlePress = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number format.');
      return;
    }
    console.log('Phone Number:', phoneNumber);
    navigation.navigate('Home'); // Navigate to Home screen
  };

  // Handle text change
  const handleChangeText = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const nonNumeric = /[^\d+]/.test(cleaned);
    if (nonNumeric) {
      setErrorMessage('Please enter only numbers');
    } else {
      setErrorMessage('');
    }

    const formattedText = formatPhoneNumber(cleaned);
    setPhoneNumber(formattedText);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.header}>Login</Text>
      <View style={styles.shadowLine} />
      <Text style={styles.subHeader}>Enter Phone Number</Text>
      <Text style={styles.description}>
        Use your phone number to log in or register an account at OneHousing Pro
      </Text>

      <CustomTextInput
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handleChangeText}
        maxLength={15}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity
        style={[
          styles.button,
          validatePhoneNumber(phoneNumber) ? styles.activeButton : styles.disabledButton,
        ]}
        onPress={handlePress}
        disabled={!validatePhoneNumber(phoneNumber)}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// Details Screen Component
function DetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Button
        title="Go Back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

// Create the stack navigator
const Stack = createNativeStackNavigator();

// Main App Component
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PhoneNumberInput">
        <Stack.Screen 
          name="PhoneNumberInput" 
          component={PhoneNumberInput} 
          options={{ title: 'Enter Phone Number' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Welcome Home' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={{ title: 'Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Stylesheet for consistent styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  header: {
    fontSize: 28,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 5,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  shadowLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  activeButton: {
    backgroundColor: '#2196F3',
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
});

export default App;
