import { Navigate, useLocation } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    return <Navigate to="/auth/login" />;
  }
  if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    if (user.role.role_name === 'admin') {
      return <Navigate to="/admin/statistic"></Navigate>;
    } else if (user.role.role_name === 'cashier') {
      return <Navigate to="/cashier/createbill"></Navigate>;
    } else if (user.role.role_name === 'warehouse manager') {
      return <Navigate to="/warehouse/products"></Navigate>;
    }
  }

  return <>{children}</>;
};

export default CheckAuth;
