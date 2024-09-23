import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, requiredRole, requiredRegion }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const region = localStorage.getItem('region'); // Assuming region is stored in localStorage

  // Debugging logs
  // console.log('Token:', token);
  // console.log('Role:', role);
  // console.log('Region:', region);
  // console.log('Required Role:', requiredRole);
  // console.log('Required Region:', requiredRegion);

  if (
    !token ||
    (requiredRole && role !== requiredRole) || 
    (requiredRegion && region !== requiredRegion)
  ) {
    // console.log('Access Denied');
    return <Navigate to="/signin" />;
  }

  return children;
};

export default RoleBasedRoute;
