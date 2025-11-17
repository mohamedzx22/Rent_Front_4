// src/components/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // إذا ما فيش مستخدم مسجّل يدخلّ
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // إذا الدور مش منسوب للأدوار المسموح لها
    return <Navigate to="/" replace />;
  }

  // كل شيء تمام، عرض المحتوى
  return children;
};

export default ProtectedRoute;
