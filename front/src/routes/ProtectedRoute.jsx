import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { HEADER_ROUTES } from '../constants';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={HEADER_ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function GuestOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={HEADER_ROUTES.TESTS} replace />;
  }

  return <Outlet />;
}
