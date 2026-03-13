import { Navigate } from 'react-router-dom';
import adminApi from '../../../services/adminApi';

export function ProtectedRoute({ children }) {
  if (!adminApi.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
