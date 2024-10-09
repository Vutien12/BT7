// PhoneNumberContext.js
import React, { createContext, useContext, useState } from 'react';

// Tạo context
const PhoneNumberContext = createContext();

// Tạo Provider component
export const PhoneNumberProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Hàm để đăng xuất
  const logout = () => {
    setPhoneNumber('');
  };

  return (
    <PhoneNumberContext.Provider value={{ phoneNumber, setPhoneNumber, logout }}>
      {children}
    </PhoneNumberContext.Provider>
  );
};

// Custom hook để sử dụng PhoneNumberContext
export const usePhoneNumber = () => {
  return useContext(PhoneNumberContext);
};
