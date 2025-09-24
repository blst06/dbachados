import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import React from 'react';

interface PrivateRoutesProps {
  children: React.ReactNode;
}

const PrivateRoutes = ({ children }: PrivateRoutesProps) => {
  const { auth } = useAuth();

  return auth ? children : <Navigate to="/signin" />;
};

export default PrivateRoutes;