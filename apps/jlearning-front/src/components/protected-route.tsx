import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
