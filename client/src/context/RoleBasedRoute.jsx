import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || (requiredRole && role !== requiredRole)) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default RoleBasedRoute;
