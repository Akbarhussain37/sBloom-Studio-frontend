import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role protection is needed, check profile role
  if (allowedRoles && allowedRoles.length > 0) {
    // If profile hasn't loaded yet but user has (should be rare due to AuthContext logic, but safe fallback)
    if (!profile) {
      return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(profile.role)) {
      // Redirect to correct public experience based on their actual role
      if (profile.role === 'kid') {
        return <Navigate to="/kids-zone" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
