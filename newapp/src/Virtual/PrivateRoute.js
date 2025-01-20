// PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);  // Assuming you have user in context

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/" />;
  }

  return children;  // If user is authenticated, render the children
};

export default PrivateRoute;
