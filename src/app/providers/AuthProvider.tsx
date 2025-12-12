import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../states/user.store";

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  requireAuth = true,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useUserStore();
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
