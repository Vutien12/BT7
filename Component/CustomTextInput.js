// /Component/CustomTextInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({ value, onChangeText, placeholder, keyboardType }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 18,
    paddingLeft: 10,
    width: '100%',
  },
});

export default CustomTextInput;
