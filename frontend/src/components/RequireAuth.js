import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

function RequireAuth({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default RequireAuth;
