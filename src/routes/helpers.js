// src/routes/helper.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ROUTE_PATHS } from './constant';

// Ye helper check karega ke user login hai ya nahi
// Agar login nahi hoga, to usey Login page par bhej dega
export function PrivateRoute(props) {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to={ROUTE_PATHS.LOGIN} />;
  }

  return props.children;
}

// Admin checking helper (Optional)
export function AdminRoute(props) {
  const { user } = useContext(AuthContext);

  // Farz karein user object mein "role" field hai
  if (!user || user.role !== 'admin') {
    return <Navigate to={ROUTE_PATHS.HOME} />;
  }

  return props.children;
}