import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!token) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
}


