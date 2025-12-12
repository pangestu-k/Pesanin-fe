import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
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
  const { isAuthenticated, user, _hasHydrated, setHasHydrated } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    // Set hasHydrated setelah komponen mount
    if (!_hasHydrated) {
      setHasHydrated(true);
    }
  }, [_hasHydrated, setHasHydrated]);

  // Tunggu hydration selesai sebelum cek auth
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

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
