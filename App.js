// App.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomTextInput from './Component/CustomTextInput';
import { PhoneNumberProvider, usePhoneNumber } from './PhoneNumberContext';

// Home Screen Component
function HomeScreen({ navigation }) {
  const { phoneNumber, logout } = usePhoneNumber(); // Lấy phoneNumber và hàm logout từ context

  // Hàm xử lý khi nhấn nút Logout
  const handleLogout = () => {
    Alert.alert(
      'Đăng Xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng Xuất',
          onPress: () => {
            logout(); // Xóa số điện thoại khỏi context
            navigation.navigate('PhoneNumberInput'); // Điều hướng về màn hình nhập số điện thoại
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.phoneText}>Đăng nhập với số: {phoneNumber}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Details')}
      >
        <Text style={styles.buttonText}>Go to Details</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// Phone Number Input Component
const PhoneNumberInput = ({ navigation }) => {
  const { setPhoneNumber } = usePhoneNumber(); // Sử dụng setPhoneNumber từ context
  const [phoneInput, setPhoneInput] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  // Hàm định dạng số điện thoại
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

  // Hàm kiểm tra định dạng số điện thoại
  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  };

  // Xử lý khi nhấn nút Continue
  const handlePress = () => {
    if (!validatePhoneNumber(phoneInput)) {
      Alert.alert('Số điện thoại không hợp lệ', 'Vui lòng nhập đúng định dạng số điện thoại.');
      return;
    }
    setPhoneNumber(phoneInput); // Lưu số điện thoại vào context
    navigation.navigate('Home'); // Điều hướng đến màn hình Home
  };

  // Xử lý khi thay đổi văn bản
  const handleChangeText = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const nonNumeric = /[^\d+]/.test(cleaned);
    if (nonNumeric) {
      setErrorMessage('Vui lòng chỉ nhập số');
    } else {
      setErrorMessage('');
    }

    const formattedText = formatPhoneNumber(cleaned);
    setPhoneInput(formattedText);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.header}>Login</Text>
      <View style={styles.shadowLine} />
      <Text style={styles.subHeader}>Nhập Số Điện Thoại</Text>
      <Text style={styles.description}>
        Sử dụng số điện thoại để đăng nhập hoặc đăng ký tài khoản tại OneHousing Pro
      </Text>

      <CustomTextInput
        placeholder="Nhập số điện thoại của bạn"
        keyboardType="phone-pad"
        value={phoneInput}
        onChangeText={handleChangeText}
        maxLength={15}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity
        style={[
          styles.button,
          validatePhoneNumber(phoneInput) ? styles.activeButton : styles.disabledButton,
        ]}
        onPress={handlePress}
        disabled={!validatePhoneNumber(phoneInput)}
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

// Tạo stack navigator
const Stack = createNativeStackNavigator();

// Main App Component
function App() {
  return (
    <PhoneNumberProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="PhoneNumberInput">
          <Stack.Screen 
            name="PhoneNumberInput" 
            component={PhoneNumberInput} 
            options={{ title: 'Nhập Số Điện Thoại' }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Chào Mừng' }}
          />
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen} 
            options={{ title: 'Chi Tiết' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PhoneNumberProvider>
  );
}

// Stylesheet cho ứng dụng
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 5,
    color: '#333',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#f44336', // Màu đỏ cho nút Logout
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  phoneText: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
  },
});

export default App;
