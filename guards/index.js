import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../services/auth";
import { getUserRole } from "../services/auth";

export const AuthGuard = ({ roles = [], redirectTo = "/login" }) => {
  const { token, user } = getAuthToken();
  
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (roles.length === 0) {
    return <Outlet />;
  }
  
const hasRequiredRole = roles.some(
  requiredRole => {
    const userRole = getUserRole();
    return userRole && userRole.toLowerCase() === requiredRole.toLowerCase();
  }
);  
  return hasRequiredRole ? <Outlet /> : <Navigate to={`/${user.role.toLowerCase()}-home`} replace />;
};

// Public Only Guard (for routes like login/register when user is already authenticated)
export const PublicOnlyGuard = ({ redirectTo = "/" }) => {
  const { token } = getAuthToken();
  return !token ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

// Role Specific Guards (for convenience)
export const AdminGuard = () => <AuthGuard roles={['Admin']} />;
export const LandlordGuard = () => <AuthGuard roles={['Landlord']} />;
export const TenantGuard = () => <AuthGuard roles={['Tenant']} />;
export const AuthenticatedGuard = () => <AuthGuard roles={['Admin', 'Landlord', 'Tenant']} />;