import { Navigate, Outlet, useLocation } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);
  if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    return <Navigate to="/auth/login" />;
  }
  if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    if (user.role.role_name === 'admin') {
      return <Navigate to="/admin/statistic"></Navigate>;
    } else if (user.role.role_name === 'cashier') {
      return <Navigate to="/"></Navigate>;
    } else if (user.role.role_name === 'warehouse manager') {
      return <Navigate to="/warehouse/products"></Navigate>;
    }
  }

  return <>{children}</>;
};

export default CheckAuth;
