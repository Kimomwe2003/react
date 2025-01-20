import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle login
  const login = (token, userObj) => {
    // Logic for setting user and token
    setUser(userObj);
    localStorage.setItem('token', token);
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
